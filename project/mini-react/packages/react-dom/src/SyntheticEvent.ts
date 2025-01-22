import { Container } from 'hostConfig';
import { unstable_ImmediatePriority, unstable_NormalPriority, unstable_UserBlockingPriority, unstable_runWithPriority } from 'scheduler';
import { Props } from 'shared/ReactTypes';

export const elementPropsKey = '__props'
const validEventTypeList = ['click']

type EventCallbacks = (e: Event) => void

interface SyntheticEvent extends Event {
    __stopProppagation: boolean
}

interface Paths {
    capture: EventCallbacks[],
    bubble: EventCallbacks[]
}

export interface DOMElement extends Element {
    [elementPropsKey]: Props
}
export function updateFiberProps(node: DOMElement, props: Props) {
    node[elementPropsKey] = props
}

export function initEvent(container: Container, eventType: string) {
    if (!validEventTypeList.includes(eventType)) {
        console.warn('当前不支持', eventType);
        return
    }
    if (__DEV__) {
        console.log('初始化事件', eventType);

    }
    container.addEventListener(eventType, e => {
        dispatchEvent(container, eventType, e)
    })
}

export function createSyntheticEvent(e: Event) {
    const syntheticEvent = e as SyntheticEvent
    syntheticEvent.__stopProppagation = false
    const originStopPropagation = e.stopPropagation
    syntheticEvent.stopPropagation = () => {
        syntheticEvent.__stopProppagation = true
        if (originStopPropagation) {
            originStopPropagation()
        }
    }
    return syntheticEvent
}

export function dispatchEvent(container: Container, eventType: string, e: Event) {
    const targetElement = e.target
    if (targetElement === null) {
        console.warn('事件不存在target', e);
        return
    }
    // 收集沿途的事件
    const { bubble, capture } = collectPaths(targetElement as DOMElement, container, eventType)
    // 构造合成事件
    const se = createSyntheticEvent(e)
    // 遍历capture
    triggerEventFlow(capture, se)
    if (!se.__stopProppagation) {
        // 遍历bubble   
        triggerEventFlow(bubble, se)
    }
}

export function triggerEventFlow(paths: EventCallbacks[], se: SyntheticEvent) {
    for (let i = 0; i < paths.length; i++) {
        const callback = paths[i]
        // 将当前上下文环境的优先级，改成我们传入的优先级
        unstable_runWithPriority(eventTypeToSchedulerPriority(se.type), () => {
            callback.call(null, se)
        })
        if (se.__stopProppagation) {
            break
        }
    }
}

export function getEventCallbackNameFromEventType(eventType: string): string[] | undefined {
    return {
        // 捕获阶段 -> 冒泡阶段
        click: ['onClickCapture', 'onClick']
    }[eventType];
}
export function collectPaths(targetElement: DOMElement, container: Container, eventType: string) {
    const paths: Paths = {
        capture: [],
        bubble: []
    }
    while (targetElement && targetElement !== container) {
        const elementProps = targetElement[elementPropsKey]
        if (elementProps) {
            const callbackNameList = getEventCallbackNameFromEventType(eventType)
            if (callbackNameList) {
                callbackNameList.forEach((callbackName, i) => {
                    const eventCallback = elementProps[callbackName]
                    if (eventCallback) {
                        if (i == 0) {
                            // capture
                            paths.capture.unshift(eventCallback)
                        } else {
                            paths.bubble.push(eventCallback)
                        }
                    }
                })
            }
        }
        targetElement = targetElement.parentNode as DOMElement
    }
    return paths
}

function eventTypeToSchedulerPriority (eventType: string) {
    switch(eventType){
        case 'click':
        case 'keydown':
        case 'keyup':
            return unstable_ImmediatePriority
        case 'scroll':
            return unstable_UserBlockingPriority
        default:
            return unstable_NormalPriority
    }
}