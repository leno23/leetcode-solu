import {
	unstable_ImmediatePriority as ImmediatePriority,
	unstable_UserBlockingPriority as UserBlockingPriority,
	unstable_NormalPriority as NormalPriority,
	unstable_LowPriority as LowPriority,
	unstable_IdlePriority as IdlePriority,
	unstable_scheduleCallback as scheduleCallback,
	unstable_shouldYield as shouldYield,
	unstable_getFirstCallbackNode as getFirstCallbackNode,
	unstable_cancelCallback as cancelCallback
} from 'scheduler';
const button = document.querySelector('button');
const root = document.querySelector('#root');

function schedule() {
	const cbNode = getFirstCallbackNode();
	const curWork = workList.sort((w1, w2) => w1.priority - w2.priority)[0];

	// TODO 策略逻辑
	if (!curWork) {
		curCallback = null;
		cbNode && cancelCallback(cbNode);
		return;
	}
	if (curWork.priority === prePriority) {
		return;
	}
	// 更高优先级的work
	cbNode && cancelCallback(cbNode);

	curCallback = scheduleCallback(curWork.priority, perform.bind(null, curWork));
}

function perform(work, didTimeout) {
	/**
	 * 1.work.priority
	 * 2.饥饿问题
	 * 3.时间切片
	 */
	const needSync = work.priority === ImmediatePriority || didTimeout;
	while ((needSync || !shouldYield()) && work.count) {
		work.count--;
		insertSpan(work.priority + '');
	}
	// 中断执行||执行完
	prePriority = work.priority;
	if (!work.count) {
		const workIndex = workList.indexOf(work);
		workList.splice(workIndex, 1);
		prePriority = IdlePriority;
	}
	const preCallback = curCallback;
	schedule();
	const newCallback = curCallback;
	if (newCallback && newCallback === preCallback) {
		// 如果仅有一个work，scheduler有个优化路径：如果调度的回调函数的返回是函数，则会继续调度返回的函数
		return perform.bind(null, work);
	}
}

function insertSpan(content) {
	const span = document.createElement('span');
	span.textContent = content;
	span.className = `pri-${content}`;
	doSomeBusyWork();
	root?.appendChild(span);
}
function doSomeBusyWork() {
	let i = 0;
	while (i < 10000000) {
		i++;
	}
}
const workList = [];
let prePriority = IdlePriority;
let curCallback = null;

[LowPriority, NormalPriority, UserBlockingPriority, ImmediatePriority].forEach(
	(priority) => {
		const button = document.createElement('button');
		let label = [
			'',
			'ImmediateProirity',
			'UserBlockingPriority',
			'NormalPriority',
			'LowPriority'
		][priority];
		button.textContent = label;
		button.onclick = () => {
			workList.unshift({ count: 100, priority });
			schedule();
		};
		root.appendChild(button);
	}
);
