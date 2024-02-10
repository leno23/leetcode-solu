import { Props, ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement, createWorkInProgress } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { ChildDeletion, Placement } from './fiberFlags';
type ExistingChildren = Map<string | number, FiberNode>

// 节点是否可以复用
function childReconciler(shouldTrackEffect: boolean) {
	function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
		if (!shouldTrackEffect) {
			return;
		}
		const deletions = returnFiber.deletions;
		if (deletions == null) {
			returnFiber.deletions = [childToDelete];
			returnFiber.flags |= ChildDeletion;
		} else {
			deletions.push(childToDelete);
		}
	}
	function deleteRemainChildren(returnFiber: FiberNode, currentFirstChild: FiberNode | null) {
		if (!shouldTrackEffect) {
			return
		}
		let childToDelete = currentFirstChild
		while (childToDelete !== null) {
			deleteChild(returnFiber, childToDelete)
			childToDelete = childToDelete.sibling
		}

	}
	function reconcileSingleElement(returnFiber: FiberNode, currentFiber: FiberNode | null, element: ReactElementType) {
		const key = element.key;
		while (currentFiber !== null) {
			// update
			if (currentFiber.key === key) {
				if (element.$$typeof === REACT_ELEMENT_TYPE) {
					if (currentFiber.type === element.type) {
						// 可复用
						const existing = useFiber(currentFiber, element.props)
						existing.return = returnFiber;
						// 当前节点可复用,标记剩下的节点删除
						deleteRemainChildren(returnFiber, currentFiber.sibling)
						return existing;
					}
					// key相同type不同 删除所有旧的
					deleteRemainChildren(returnFiber, currentFiber);
					break
				} else {
					if (__DEV__) {
						console.warn('还未实现的react类型', element);
						break work
					}
				}
			} else {
				// key不同 删除旧的
				deleteChild(returnFiber, currentFiber);
				currentFiber = currentFiber.sibling
			}
		}
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}
	function reconcileSingleTextNode(returnFiber: FiberNode, currentFiber: FiberNode | null, content: string | number) {
		while (currentFiber != null) {
			if (currentFiber.tag === HostText) {
				// 类型没变，可以复用
				const existing = useFiber(currentFiber, { content })
				existing.return = returnFiber
				deleteRemainChildren(returnFiber, currentFiber.sibling)
				return existing
			}
			deleteChild(returnFiber, currentFiber)
			currentFiber = currentFiber.sibling

		}
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	//
	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrackEffect && fiber.alternate === null) {
			// 首屏渲染的情况
			fiber.flags |= Placement;
		}
		return fiber;
	}
	function reconcileChildArray(returnFiber: FiberNode, currentFirstChild: FiberNode | null, newChild: any[]) {
		// 最后一个可复用的fiber在current中的index
		let lastPlacedIndex: number = 0;
		// 创建的最后一个fiber
		let lastNewFiber: FiberNode | null = null
		// 创建的第一个fiber
		let firstNewFiber: FiberNode | null = null

		// 将current、保存在Map中
		const existingChildren: ExistingChildren = new Map()
		let current = currentFirstChild
		while (current !== null) {
			const keyToUse = current.key !== null ? current.key : current.index
			existingChildren.set(keyToUse, current)
			current = current.sibling
		}
		for (let i = 0; i < newChild.length; i++) {
			// 遍历newChild，寻找是否可复用
			const after = newChild[i]
			const newFiber = updateFromMap(returnFiber, existingChildren, i, after)
			// xxx -> false null
			if (newFiber === null) {
				continue
			}
			// 标记移动还是插入
			newFiber.index = i
			newFiber.return = returnFiber
			if (lastNewFiber === null) {
				lastNewFiber = newFiber
				firstNewFiber = newFiber
			} else {
				lastNewFiber.sibling = newFiber
				lastNewFiber = lastNewFiber.sibling
			}
			if (!shouldTrackEffect) {
				continue
			}

			const current = newFiber.alternate
			if (current !== null) {
				const oldIndex = current.index
				if (oldIndex < lastPlacedIndex) {
					// 移动
					newFiber.flags |= Placement
					continue
				} else {
					// 不移动
					lastPlacedIndex = oldIndex

				}
			} else {
				// mount
				newFiber.flags |= Placement
			}

		}
		// 将Map中剩下的标记为删除
		existingChildren.forEach(fiber => {
			deleteChild(returnFiber, fiber)
		})
		return firstNewFiber
	}
	function updateFromMap(returnFiber: FiberNode, existingChildren: ExistingChildren, index: number, element: any): FiberNode | null {
		const keyToUse = element.key !== null ? element.key : element.index
		const before = existingChildren.get(keyToUse)
		// HostText
		if (typeof element === 'string' || typeof element === 'number') {
			if (before) {
				if (before.tag === HostText) {
					existingChildren.delete(keyToUse)
					return useFiber(before, { content: element + '' })
				}
			}
			return new FiberNode(HostText, { content: element + '' }, null)
		}
		// ReactElement
		if (typeof element === 'object' && element !== null) {
			switch (element.$$typeof) {
				case REACT_ELEMENT_TYPE:
					if (before) {
						if (before.type === element.type) {
							existingChildren.delete(keyToUse)
							return useFiber(before, element.props)
						}
					}
					return createFiberFromElement(element)
			}
		}
		// TODO 数组类型
		if (Array.isArray(element) && __DEV__) {
			console.warn('还未实现数组类型的child');
		}
		return null
	}
	return function reconcileChildFibers(returnFiber: FiberNode, currentFiber: FiberNode | null, newChild?: ReactElementType) {
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(reconcileSingleElement(returnFiber, currentFiber, newChild));
				default:
					if (__DEV__) {
						console.warn('未实现的reconciler类型', newChild);
					}
					break;
			}
			// TODO 多节点的情况 ul>li*3
			if (Array.isArray(newChild)) {
				return reconcileChildArray(returnFiber, currentFiber, newChild)
			}
		}

		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFiber, newChild));
		}
		if (currentFiber !== null) {
			deleteChild(returnFiber, currentFiber)
		}
		if (__DEV__) {
			console.warn('未实现的reconciler类型', newChild);
		}
		return null;
	};
}

function useFiber(fiber: FiberNode, pendingProps: Props): FiberNode {
	const clone = createWorkInProgress(fiber, pendingProps)
	clone.index = 0
	clone.sibling = null
	return clone;
}
export const reconcileChildFibers = childReconciler(true);
export const mountChildFibers = childReconciler(false);
