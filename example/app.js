// import ReactDom from 'react-dom/client'
// import App from './App.jsx'

// ReactDom.createRoot(document.querySelector('#app')).render(<App></App>)

// v1
const container = document.querySelector('#app')
const root = document.createElement('div')
root.id = 'root'
container.append(root)

const textNode = document.createTextNode('')
textNode.nodeValue = 'text node'
root.append(textNode)