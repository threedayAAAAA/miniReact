const ELEMENT_TYPE_ENUM = {
    TEXT: 'TEXT'
}

const createTextElement = (text) => {
    return {
        type: ELEMENT_TYPE_ENUM.TEXT,
        props: {
            nodeValue: text,
            children: []
        }
    }
}

const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                return typeof child === 'string' 
                    ? createTextElement(child)
                    : child
            })
        }
     }
}

const render = (vdom, container) => {
    const { type, props } = vdom
    // 1. create
    const el = vdom.type === ELEMENT_TYPE_ENUM.TEXT 
        ? document.createTextNode('')
        : document.createElement(type)
    // 2. props
    Object.entries(props).forEach(([key, val]) => {
        if(key === 'children'){
            return
        }
        el[key] = val
    })
    // 3. children
    props.children.forEach(child => render(child, el))
    // 4. mounted
    container.append(el)
}

const React = {
    render,
    createElement
}

export default React