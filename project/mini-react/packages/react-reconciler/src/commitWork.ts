import { Container, appendChildToContainer, commitUpdate, removeChild } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { ChildDeletion, MutationMask, NoFlags, Placement, Update } from './fiberFlags';
import { FunctionComponent, HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FiberNode | null = null;
export function commitMutationEffects(finishedWork: FiberNode) {
	nextEffect = finishedWork;
	while (nextEffect !== null) {
		const child: FiberNode | null = nextEffect.child;
		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child;
		} else {
			up: while (nextEffect !== null) {
				commitMutationEffectsOnFiber(nextEffect);

				const sibling: FiberNode | null = nextEffect.sibling;
				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
}

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		// 去掉Placement标记
		finishedWork.flags &= ~Placement;
	}
	if ((flags & Update) != NoFlags) {
		commitUpdate(finishedWork)
		finishedWork.flags &= ~Update
	}
	// 遍历标记删除的子节点，对每个节点执行ChildDeletion
	// flags deletion
	if ((flags & ChildDeletion) !== NoFlags) {
		const deletions = finishedWork.deletions
		if (deletions != null) {
			deletions.forEach(childToDelete => {
				// 每一个需要被删除的fiber节点
				commitDeletion(childToDelete)
			})
		}
		finishedWork.flags &= ~ChildDeletion
	}
	function commitDeletion(childToDelete: FiberNode) {
		let rootHostNode: FiberNode | null = null
		// 递归子树
		// 1.根据子节点类型进行相应操作
		// 2.找到子树中的根host类型节点，删除parent dom节点
		commitNestedComponent(childToDelete, unmountFiber => {
			switch (unmountFiber.tag) {
				case HostComponent:
					if (rootHostNode === null) {
						rootHostNode = unmountFiber
					}
					// TODO 解绑ref
					break;
				case HostText:
					if (rootHostNode == null) {
						rootHostNode = unmountFiber
					}
					return
				case FunctionComponent:
					// TODO useEffect unmount，解绑ref
					return
				default:
					if (__DEV__) {
						console.warn("未处理的 unmount 类型", unmountFiber);
					}
					break;
			}
		})
		// 一处rootHostNode的DOM
		if (rootHostNode !== null) {
			const hostParent = getHostParent(childToDelete)
			if (hostParent != null) {
				removeChild((rootHostNode as FiberNode).stateNode, hostParent)
			}

		}
		// 重置标记
		childToDelete.return = null
		childToDelete.child = null

	}

	function commitNestedComponent(root: FiberNode, onCommitUnmount: (fiber: FiberNode) => void) {
		let node = root
		while (true) {
			onCommitUnmount(node)
			if (node.child !== null) {
				// 向下遍历
				node.child.return = node
				node = node.child
				continue
			}
			if (node == root) {
				return
			}
			while (node.sibling === null) {
				if (node.return === null || node.return == root) {
					return
				}
				// 向上归
				node = node.return
			}
			node.sibling.return = node.return
			node = node.sibling
		}
	}
};

const commitPlacement = (finishedWork: FiberNode) => {
	// parent dom
	// finishedWork  dom
	if (__DEV__) {
		console.warn('执行Placement操作', finishedWork);
	}
	// parent DOM
	const hostParent = getHostParent(finishedWork) as Element;
	// finishedWork DOM
	appendPlacementNodeIntoContainer(finishedWork, hostParent);
};

function getHostParent(fiber: FiberNode) {
	let parent = fiber.return;
	while (parent) {
		const parentTag = parent.tag;
		// HostComponent HostRoot
		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		parent = parent.return;
	}
	if (__DEV__) {
		console.warn('未找到host parent');
	}
}

//
function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	// 是以下两种host类型
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;
		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
