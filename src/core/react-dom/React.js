import { runTask } from './WorkLoop.js'
import { RenderNode } from './RenderNode.js'

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

let rootRenderNode = null
const performanceRender = (vdom, container) => {
    rootRenderNode = new RenderNode(vdom, container)
    let nextNode = rootRenderNode
    runTask(() => {
        if(nextNode){
            nextNode = performanceRenderUnite(nextNode)
        }
    })
}

function initRenderNodeEl(renderNode) {
    if(renderNode.dom){
        return 
     }
    const { vdom: { type } } = renderNode
    const dom = type === ELEMENT_TYPE_ENUM.TEXT 
        ? document.createTextNode('')
        : document.createElement(type)
    renderNode.dom = dom
}

function processRenderNodeProp(renderNode){
    const { vdom: { props } } = renderNode
    Object.entries(props).forEach(([key, val]) => {
        if(key === 'children'){
            return
        }
        renderNode.dom[key] = val
    })
}

function initChildrenNode(renderNode){
    const { vdom: { props } } = renderNode
    const children = []
    let preChildRenderNode
    props.children.forEach(child => {
        const newRenderNode = new RenderNode(child, renderNode.dom)
        newRenderNode.parent = renderNode

        if(preChildRenderNode){
            preChildRenderNode.sibling = newRenderNode
        }
        preChildRenderNode = newRenderNode

        children.push(newRenderNode)
    })
    renderNode.children = children
}

function getNextRenderNode(renderNode){
    return renderNode.children?.[0] ?? renderNode.sibling ?? renderNode.parent.sibling
}

function commitDomMount(){
    let nextNextRenderNode = rootRenderNode
    while(nextNextRenderNode){
        const { dom, container } = nextNextRenderNode
        container.append(dom)
        nextNextRenderNode = getNextRenderNode(nextNextRenderNode)
    }
    rootRenderNode = null
}

const performanceRenderUnite = (renderNode) => {
    // 1. create
    initRenderNodeEl(renderNode)

    // 2. props
    processRenderNodeProp(renderNode)

    // 3. 根据children的指针,生成渲染任务的链表结构
    initChildrenNode(renderNode)

    // 4. 返回要执行的下一个任务
    const nextNextRenderNode = getNextRenderNode(renderNode)

    // 5. 统一执行dom的挂载
    if(!nextNextRenderNode){
        commitDomMount()
    }

    return nextNextRenderNode
}

const React = {
    render: performanceRender,
    createElement
}

export default React