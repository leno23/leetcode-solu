import internals from 'shared/internals';
import { FiberNode } from './fiber';
import { Dispatcher } from 'react/src/currentDispatcher';
import { Dispatch } from 'react/src/currentDispatcher';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	processUpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { Action } from 'shared/ReactTypes';

let currentlyRenderingFiber: FiberNode | null = null;

// 当前正在处理的hook
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;
const { currentDispatcher } = internals;

interface Hook {
	memorizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}

export function renderWithHooks(wip: FiberNode) {
	// 赋值
	currentlyRenderingFiber = wip;
	// 重置  memorizedState保存的是hooks的链表
	wip.memorizedState = null;

	const current = wip.alternate;
	if (current !== null) {
		// update
		currentDispatcher.current = HooksDispatcherOnUpdate;
	} else {
		// mount
		// 对应mount阶段对应的hooks实现的集合，
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);
	// 重置操作
	currentlyRenderingFiber = null;
	workInProgressHook = null
	currentHook = null
	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};
const HooksDispatcherOnUpdate: Dispatcher = {
	useState: updateState
};

function mountState<State>(
	initialState: State | (() => State)
): [State, Dispatch<State>] {
	// 找到当前useState对应的 hook数据
	const hook = mountWorkInProgressHook();
	let memorizedState;
	if (initialState instanceof Function) {
		memorizedState = initialState();
	} else {
		memorizedState = initialState;
	}

	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;
	hook.memorizedState = memorizedState

	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
	queue.dispatch = dispatch;
	return [memorizedState, dispatch];
}
function updateState<State>(): [State, Dispatch<State>] {
	// 找到当前useState对应的 hook数据
	const hook = updateWorkInProgressHook();

	// 计算新state的逻辑
	const queue = hook.updateQueue as UpdateQueue<State>
	const pending = queue.shared.pending
	if (pending !== null) {
		const { memorizedState } = processUpdateQueue(hook.memorizedState, pending)
		hook.memorizedState = memorizedState
	}
	return [hook.memorizedState, queue.dispatch as Dispatch<State>]
}

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(fiber);
}

function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memorizedState: null,
		updateQueue: null,
		next: null
	};
	if (workInProgressHook === null) {
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memorizedState = workInProgressHook;
		}
	} else {
		// mount时  后续的hook
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
}
function updateWorkInProgressHook(): Hook {
	// 从当前fiber的alternate也就是currentFiber中，取到对应的Hook，创建新的Hook数据并返回
	// TODO render阶段触发的更新
	let nextCurrentHook: Hook | null
	if (currentHook === null) {
		const current = currentlyRenderingFiber?.alternate
		if (current !== null) {
			nextCurrentHook = current?.memorizedState
		} else {
			// mount阶段
			nextCurrentHook = null
		}
	} else {
		// 这个FC  update 后续的hook
		nextCurrentHook = currentHook.next
	}
	if (nextCurrentHook == null) {
		//  mount/update  u1 u2 u3
		// update         u1 u2 u3 u4
		/*
		if(){
			const xxx = useState()
		}
		*/
		throw new Error(`组件${currentlyRenderingFiber?.type}本次执行时的Hook比上次执行时多`)
	}
	currentHook = nextCurrentHook as Hook
	const newHook: Hook = {
		memorizedState: currentHook.memorizedState,
		updateQueue: currentHook.updateQueue,
		next: null
	};
	if (workInProgressHook === null) {
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = newHook;
			currentlyRenderingFiber.memorizedState = workInProgressHook;
		}
	} else {
		// mount时  后续的hook
		workInProgressHook.next = newHook;
		workInProgressHook = newHook;
	}
	return workInProgressHook;
}
