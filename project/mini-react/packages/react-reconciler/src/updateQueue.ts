import { Dispatch } from 'react/src/currentDispatcher';
import { Action } from 'shared/ReactTypes';
import { Lane } from './fiberLanes';

export interface Update<State> {
	action: Action<State>;
	lane: Lane;
	next: Update<State> | null;
}
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
	dispatch: Dispatch<State> | null;
}

export const createUpdate = <State>(action: Action<State>, lane: Lane): Update<State> => {
	return {
		action,
		lane,
		next: null
	};
};

export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		},
		dispatch: null
	} as UpdateQueue<State>;
};

export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	// 这条链表中最后插入的update
	const pending = updateQueue.shared.pending;
	if (pending === null) {
		// pending = a -> a
		update.next = update;
	} else {
		// pending = b -> a -> b
		update.next = pending.next;
		pending.next = update;
	}
	updateQueue.shared.pending = update;
};

// updateQueue消费update
export const processUpdateQueue = <State>(
	// 初始状态和要消费的update
	baseState: State,
	pendingUpdate: Update<State> | null,
	renderLane: Lane
	// 返回全新的状态
): { memorizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedState: baseState
	};
	if (pendingUpdate !== null) {
		let first = pendingUpdate.next;
		let pending = pendingUpdate.next as Update<any>;
		do {
			const updateLane = pending.lane;
			if (updateLane === renderLane) {
				const action = pendingUpdate.action;
				if (action instanceof Function) {
					// baseState 1 update (x) => 4x -< memorizedState
					baseState = action(baseState);
				} else {
					// baseState 1 update 2 -> memorizedState 2
					result.memorizedState = action;
				}
			} else {
				if (__DEV__) {
					console.error('不应该进入updateLane !== renderLane逻辑');
				}
			}
			pending = pending?.next as Update<any>;
		} while (pending !== first);
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			result.memorizedState = action(baseState);
		} else {
			result.memorizedState = action;
		}
	}
	result.memorizedState = baseState;
	return result;
};
