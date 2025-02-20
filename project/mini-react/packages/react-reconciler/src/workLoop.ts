import { beginWork } from './beginWork';
import {
	commitHookEffectListCreate,
	commitHookEffectListDestory,
	commitHookEffectListUnmount,
	commitMutationEffects
} from './commitWork';
import { completeWork } from './completeWork';
import {
	FiberNode,
	FiberRootNode,
	createWorkInProgress,
	pendingPassiveEffect
} from './fiber';
import { HookHasEffect, Passive } from './fiberEffectTags';
import { MutationMask, NoFlags, PassiveEffect, PassiveMask } from './fiberFlags';
import {
	Lane,
	NoLane,
	SyncLane,
	getHighestPriorityLane,
	lanesToSchedulerPriority,
	markRootFinished,
	mergeLanes
} from './fiberLanes';
import {
	flushSyncCallbacks,
	scheduleMicroTask,
	scheduleSyncCallback
} from './syncTaskQueue';
import { HostRoot } from './workTags';
import {
	unstable_scheduleCallback as schedulerCallback,
	unstable_NormalPriority as NormalPriority,
	unstable_shouldYield,
	unstable_cancelCallback
} from 'scheduler';

let workInProgress: FiberNode | null = null;
let wipRootRenderLane: Lane = NoLane; // 本次更新的lane
let rootDoesHasPassiveEffect: boolean = false;

// render阶段退出的状态
type RootExitStatus = number;
const RootInComplete = 1;
const RootCompleted = 2;
// TODO 执行过程中报错了

function prepareFreshStack(root: FiberRootNode, lane: Lane) {
	// 为hostRoot创建wip
	root.finishedLane = NoLane;
	root.finishedWork = null;
	workInProgress = createWorkInProgress(root.current, {});
	wipRootRenderLane = lane;
}

// 在fiber中调度update
export function scheduleUpdateOnFiber(fiber: FiberNode, lane: Lane) {
	// 调度功能
	// fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	markRootUpdated(root, lane);
	if (root === null) {
		return;
	}
	ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root: FiberRootNode) {
	const updateLane = getHighestPriorityLane(root.pendingLanes);
	const existingCallback = root.callbackNode;

	// 没有work要做了
	if (updateLane === NoLane) {
		if (existingCallback !== null) {
			unstable_cancelCallback(existingCallback);
		}
		root.callbackNode = null;
		root.callbackPriority = NoLane;
		return;
	}

	const curPriority = updateLane;
	const prePriority = root.callbackPriority;
	// 当前优先级和之前的优先级一样的话
	if (curPriority === prePriority) {
		return;
	}
	if (existingCallback !== null) {
		unstable_cancelCallback(existingCallback);
	}
	let newCallbackNode = null;
	if (updateLane === SyncLane) {
		// 同步优先级，用微任务调度
		if (__DEV__) {
			console.log('在微任务中调度，优先级', updateLane);
		}
		// syncQueue:  [performSyncWorkOnRoot,performSyncWorkOnRoot,...]
		scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
		scheduleMicroTask(flushSyncCallbacks);
	} else {
		// 其他优先级  用宏任务调度   Vue Svelte中没有这个逻辑
		const schedulerPriority = lanesToSchedulerPriority(updateLane);
		// @ts-ignore
		newCallbackNode = schedulerCallback(
			schedulerPriority,
			performConcurrentWorkOnRoot.bind(null, root)
		);
	}
	root.callbackNode = newCallbackNode;
	root.callbackPriority = curPriority;
}

function markRootUpdated(root: FiberRootNode, lane: Lane) {
	root.pendingLanes = mergeLanes(root.pendingLanes, lane);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag == HostRoot) {
		return node.stateNode;
	}
	return null;
}

function performConcurrentWorkOnRoot(root: FiberRootNode, didTimeout: boolean): any {
	// 保证useEffect回调执行
	const curCallback = root.callbackNode;
	const didFlushPassiveEffects = flushPassiveEffects(root.pendingPassiveEffect);
	// 如果useEffect有更高优先级的任务，应该停止当前执行
	if (didFlushPassiveEffects) {
		if (root.callbackNode !== curCallback) {
			return null;
		}
	}
	const lane = getHighestPriorityLane(root.pendingLanes);
	const curCallbackNode = root.callbackNode;
	if (lane === NoLane) {
		return null;
	}
	// @ts-ignore
	const needSync = lane === SyncLane || didTimeout;
	// render阶段
	const exitStatus = renderRoot(root, lane, !needSync);

	ensureRootIsScheduled(root);

	if (exitStatus === RootInComplete) {
		// 中断
		if (root.callbackNode !== curCallbackNode) {
			return null;
		}
		return performConcurrentWorkOnRoot.bind(null, root);
	}
	if (exitStatus === RootCompleted) {
		const finishedWork = root.current.alternate;
		root.finishedWork = finishedWork;
		root.finishedLane = lane;
		wipRootRenderLane = NoLane;

		// wip fiberNode树 树中的flags
		commitRoot(root);
	} else if (__DEV__) {
		console.error(`还未实现的并发更新结束状态`);
	}
}

// 触发更新流程
function performSyncWorkOnRoot(root: FiberRootNode) {
	const nextLine = getHighestPriorityLane(root.pendingLanes);
	if (nextLine !== SyncLane) {
		// 其他比SyncLane低的优先级
		// NoLane
		ensureRootIsScheduled(root);
		return;
	}
	const exitStatus = renderRoot(root, nextLine, false);
	if (exitStatus === RootInComplete) {
		const finishedWork = root.current.alternate;
		root.finishedWork = finishedWork;
		root.finishedLane = nextLine;
		wipRootRenderLane = NoLane;

		// wip fiberNode树 树中的flags
		commitRoot(root);
	} else if (__DEV__) {
		console.error(`还未实现的同步更新结束状态`);
	}
}

function renderRoot(root: FiberRootNode, lane: Lane, shouldTimeSlice: boolean) {
	if (__DEV__) {
		console.log(`开始${shouldTimeSlice ? '并发' : '同步'}更新`, root);
	}
	// 是否是新的lane
	if (wipRootRenderLane !== lane) {
		// 初始化
		prepareFreshStack(root, lane);
	}
	do {
		try {
			//是否开启了时间切片
			shouldTimeSlice ? workLoopConcurrent() : workLoopSync();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);
	// 中断执行
	if (shouldTimeSlice && workInProgress !== null) {
		return RootInComplete;
	}
	// 或者执行完了
	if (!shouldTimeSlice && workInProgress !== null && __DEV__) {
		console.error(`render阶段结束时wip不应该不为null`);
	}
	// TODO 报错
	return RootCompleted;
}
function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;
	if (finishedWork === null) {
		return;
	}
	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork);
	}
	const lane = root.finishedLane;
	if (lane === NoLane && __DEV__) {
		console.error('commit阶段finishedLane不应该是NoLane');
	}
	// 重置
	root.finishedWork = null;
	root.finishedLane = NoLane;
	markRootFinished(root, lane);

	// 存在函数组件 需要执行useEffect回调的
	if (
		(finishedWork.flags & PassiveMask) !== NoFlags ||
		(finishedWork.subtreeFlags & PassiveMask) !== NoFlags
	) {
		if (!rootDoesHasPassiveEffect) {
			rootDoesHasPassiveEffect = true;
			schedulerCallback(NormalPriority, () => {
				// 执行副作用
				flushPassiveEffects(root.pendingPassiveEffect);
				return;
			});
		}
	}
	// 判断是否存在三个子阶段需要执行的操作
	// root flags root
	const subtreeHasEffect = (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
	if (subtreeHasEffect || rootHasEffect) {
		// beforeMutation
		// mutation Placement
		commitMutationEffects(finishedWork, root);
		root.current = finishedWork;
	} else {
		// layout
		root.current = finishedWork;
	}
	rootDoesHasPassiveEffect = false;
	ensureRootIsScheduled(root);
}
function flushPassiveEffects(pendingPassiveEffect: pendingPassiveEffect) {
	// 副作用函数是否执行
	let didFlushPassiveEffects = false;
	pendingPassiveEffect.unmount.forEach((effect) => {
		didFlushPassiveEffects = true;
		commitHookEffectListUnmount(Passive, effect);
	});
	pendingPassiveEffect.unmount = [];

	pendingPassiveEffect.update.forEach((effect) => {
		didFlushPassiveEffects = true;
		commitHookEffectListDestory(Passive | HookHasEffect, effect);
	});
	pendingPassiveEffect.update.forEach((effect) => {
		didFlushPassiveEffects = true;
		commitHookEffectListCreate(Passive | HookHasEffect, effect);
	});
	pendingPassiveEffect.update = [];
	flushSyncCallbacks();
	return didFlushPassiveEffects;
}
function workLoopSync() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}
function workLoopConcurrent() {
	while (workInProgress !== null && !unstable_shouldYield) {
		performUnitOfWork(workInProgress);
	}
}
function performUnitOfWork(fiber: FiberNode) {
	// 有子节点就遍历子节点
	const next = beginWork(fiber, wipRootRenderLane);
	fiber.memorizedProps = fiber.pendingProps;
	if (next === null) {
		// 没有子节点遍历兄弟节点
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
