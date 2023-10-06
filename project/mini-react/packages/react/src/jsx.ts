import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { ElementType, Key, Props, ReactElementType, Ref } from 'shared/ReactTypes'

const ReactElement = function (type: ElementType, key: Key, ref: Ref, props: Props): ReactElementType {
    const element = {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref,
        props,
        __mark: 'kkkkkk'
    }
    return element
}
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
    let key: Key = null
    let props: Props = {};
    let ref: Ref = null
    for (const prop in config) {
        const val = config[prop]
        if (prop == 'key') {
            if (val !== undefined) {
                key = '' + val
            }
            continue
        }
        if (prop == 'ref') {
            if (val !== undefined) {
                ref = val
            }
            continue
        }
        if ({}.hasOwnProperty.call(config, prop)) {
            props[prop] = val
        }

    }
    const maybeChildLength = maybeChildren.length
    if (maybeChildLength) {
        if (maybeChildLength === 1) {
            props.children = maybeChildren[0]
        } else {
            props.children = maybeChildren
        }
    }
    return ReactElement(type, key, ref, props)
}

export const jsxDEV = (type: ElementType, config: any) => {
    let key: Key = null
    let props: Props = {};
    let ref: Ref = null
    for (const prop in config) {
        const val = config[prop]
        if (prop == 'key') {
            if (val !== undefined) {
                key = '' + val
            }
            continue
        }
        if (prop == 'ref') {
            if (val !== undefined) {
                ref = val
            }
            continue
        }
        if ({}.hasOwnProperty.call(config, prop)) {
            props[prop] = val
        }

    }
   
    return ReactElement(type, key, ref, props)
}