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
const container = document.querySelector('#app')

const ELEMENT_TYPE_ENUM = {
    TEXT: 'TEXT'
}

const textVdom = {
    type: ELEMENT_TYPE_ENUM.TEXT,
    props: {
        nodeValue: 'text',
        children: []
    }
}
const rootVdom = {
   type: "div",
   props: {
        id: 'root',
        children: [
            textObj
        ]
   }
}

const root = document.createElement(textVdom.type)
root.id = 'root'
container.append(root)

const textNode = document.createTextNode('')
textNode.nodeValue = textVdom.props.nodeValue
root.append(textNode)