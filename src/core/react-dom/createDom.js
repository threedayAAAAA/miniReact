export const ELEMENT_TYPE_ENUM = {
    TEXT: 'TEXT'
}

export function createTextElement(text) {
    return {
        type: ELEMENT_TYPE_ENUM.TEXT,
        props: {
            nodeValue: text,
            children: []
        }
    }
}

export function createElement(type, props, ...children) {
    return {
        type,
        props: {
                ...props,
                children: children.map(child => {
                    const isTextNode = typeof child === 'string' || typeof child === 'number'
                    return isTextNode
                        ? createTextElement(child)
                        : child
                })
        }
    }
}

export function createDom(renderNode) {
    const { vdom, dom } = renderNode
    if(dom){
        return 
    }
    const res = vdom.type === ELEMENT_TYPE_ENUM.TEXT 
        ? document.createTextNode('')
        : document.createElement(vdom.type)
    renderNode.dom = res
}