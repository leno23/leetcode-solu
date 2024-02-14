let syncQueue: ((...args: any) => void)[] | null = [];
let isFlushingSyncQueue = false;

export function scheduleSyncCallback(callback: (...args: any) => void) {
	if (syncQueue === null) {
		syncQueue = [callback];
	} else {
		syncQueue.push(callback);
	}
}

export function flushSyncCallbacks() {
	if (!isFlushingSyncQueue) {
		isFlushingSyncQueue = true;
		try {
			syncQueue?.forEach((cb) => cb());
		} catch (e) {
			if (__DEV__) {
				console.warn('flushSyncCallback报错', e);
			}
		} finally {
			isFlushingSyncQueue = false;
		}
	}
}

export const scheduleMicroTask =
	typeof queueMicrotask === 'function'
		? queueMicrotask
		: typeof Promise === 'function'
		? (callback: (...args: any) => void) => Promise.resolve(null).then(callback)
		: setTimeout;
