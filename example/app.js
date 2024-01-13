// import ReactDom from 'react-dom/client'
// import App from './App.jsx'

// ReactDom.createRoot(document.querySelector('#app')).render(<App></App>)

// v1
// const container = document.querySelector('#app')
// const root = document.createElement('div')
// root.id = 'root'
// container.append(root)

// const textNode = document.createTextNode('')
// textNode.nodeValue = 'text node'
// root.append(textNode)

// v2 vdom => dom
// const container = document.querySelector('#app')

// const ELEMENT_TYPE_ENUM = {
//     TEXT: 'TEXT'
// }

// const textVdom = {
//     type: ELEMENT_TYPE_ENUM.TEXT,
//     props: {
//         nodeValue: 'text',
//         children: []
//     }
// }
// const rootVdom = {
//    type: "div",
//    props: {
//         id: 'root',
//         children: [
//             textVdom
//         ]
//    }
// }

// const root = document.createElement(rootVdom.type)
// root.id = 'root'
// container.append(root)

// const textNode = document.createTextNode('')
// textNode.nodeValue = textVdom.props.nodeValue
// root.append(textNode)

// v3
const ELEMENT_TYPE_ENUM = {
    TEXT: 'TEXT'
}
const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children
        }
     }
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

const textVdom = createTextElement('text')
const rootVdom = createElement('div', { id: 'root' }, textVdom)
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
const container = document.querySelector('#app')
render(rootVdom, container)