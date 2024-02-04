import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

function childReconciler(shouldTrackEffect: boolean) {
    function reconcileSingleElement (returnFiber:FiberNode,currentFiber:FiberNode|null,element:ReactElementType) {
        function deleteChild (returnFiber:FiberNode) {
            
        }
        const key = element.key
        if(currentFiber !== null){
            if(currentFiber.key === key){
                if(element.$$typeof === REACT_ELEMENT_TYPE){
                    if(currentFiber.type ===element.type){

                    }
                }
            }else{
                if(__DEV__){
                    console.warn('还未实现的react类型',element);
                    return
                    
                }
            }
        }
        const fiber = createFiberFromElement(element)
        fiber.return = returnFiber
        return fiber
    }
    function reconcileSingleTextNode (returnFiber:FiberNode,currentFiber:FiberNode|null,content:string|number) {
        const fiber = new FiberNode(HostText,{content},null)
        fiber.return = returnFiber
        return fiber
    }

    // 
    function placeSingleChild (fiber:FiberNode) {
        if(shouldTrackEffect && fiber.alternate === null){
            // 首屏渲染的情况
            fiber.flags |= Placement
        }
        return fiber
    }
    return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
        if(typeof newChild === 'object' && newChild !==null){
            switch(newChild.$$typeof){
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(reconcileSingleElement(returnFiber,currentFiber,newChild))
                default:
                    if(__DEV__){
                        console.warn('未实现的reconciler类型',newChild);
                        
                    }
                    break
            }
        }

        if(typeof newChild === 'string' || typeof newChild === 'number'){
            return placeSingleChild(reconcileSingleTextNode(returnFiber,currentFiber,newChild));
        }
        if(__DEV__){
            console.warn('未实现的reconciler类型',newChild);
            
        }
        return null
    };
}

export const reconcileChildFibers = childReconciler(true) 
export const mountChildFibers = childReconciler(false) 