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
				commitMutationEffectOnFiber(nextEffect);

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

const commitMutationEffectOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		// 去掉Placement标记
		finishedWork.flags &= ~Placement;
	}
	if((flags & Update)!= NoFlags){
		commitUpdate(finishedWork)
		finishedWork.flags &= ~Update
	}
	if((flags & ChildDeletion) !== NoFlags){
		const deletions = finishedWork.deletions
		if(deletions!= null){
			deletions.forEach(childToDelete => {
				commitDeletion(childToDelete)
			})
		}
		finishedWork.flags &= ~ChildDeletion
	}
	function commitDeletion (childToDelete: FiberNode) {
		let rootHostNode:FiberNode | null = null
		
		commitNestedComponent(childToDelete, unmountFiber => {
			switch (unmountFiber.tag) {
				case HostComponent:
					if(rootHostNode ===null){
						rootHostNode = unmountFiber
					}
					break;
				case HostText:
					if(rootHostNode==null){
						rootHostNode = unmountFiber
					}
					return
				case FunctionComponent:
					return
				default:
					if(__DEV__){
						console.warn("Not handle unmount type",unmountFiber);
					}
					break;
			}
		})
		if(rootHostNode !== null){
			const hostParent = getHostParent(childToDelete)
			if(hostParent != null){

				removeChild(rootHostNode,hostParent)
			}

		}
		childToDelete.return=null
		childToDelete.child = null

	}

	function commitNestedComponent (root:FiberNode, onCommitUnmount: (fiber:FiberNode) => void) {
		let node = root
		while(true){
			onCommitUnmount(node)
			if(node.child !== null){
				node.child.return = node
				node = node.child
				continue
			}
			if(node==root){
				return
			}
			while(node.sibling ===null){
				if(node.return === null || node.return == root){
					return
				}
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
