import { runTask } from './WorkLoop.js'
import { RenderNode } from './RenderNode.js'

const ELEMENT_TYPE_ENUM = {
    TEXT: 'TEXT'
}

function createTextElement(text) {
    return {
        type: ELEMENT_TYPE_ENUM.TEXT,
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
                ...props,
                children: children.map(child => {
                    return typeof child === 'string' || typeof child === 'number' 
                        ? createTextElement(child)
                        : isFunctionComponent(child) 
                            ? child.type(child.props)
                            : child
                })
        }
    }
}

let rootRenderNode = null
function performanceRender(vdom, container) {
    rootRenderNode = new RenderNode(vdom)
    rootRenderNode.parent = new RenderNode({}, container)
    let nextNode = rootRenderNode
    runTask(() => {
        if(nextNode){
            nextNode = performanceRenderUnite(nextNode)
        }
    })
}

function isFunctionComponent(vdom) {
    return typeof vdom.type === 'function' 
}

function initRenderNodeEl(renderNode) {
    const { vdom, dom } = renderNode
    if(isFunctionComponent(vdom) || dom){
        return 
    }
    const res = vdom.type === ELEMENT_TYPE_ENUM.TEXT 
        ? document.createTextNode('')
        : document.createElement(vdom.type)
    renderNode.dom = res
}

function processRenderNodeProp(renderNode){
    if(isFunctionComponent(renderNode.vdom)){
        return
    }
    Object.entries(renderNode.vdom.props).forEach(([key, val]) => {
        if(key === 'children'){
            return
        }
        renderNode.dom[key] = val
    })
}

function initChildrenNode(renderNode){
    const newChildren = []
    const children = isFunctionComponent(renderNode.vdom) 
        ? [renderNode.vdom.type()]
        : renderNode.vdom.props.children
    let preChildRenderNode
    children?.forEach(child => {
        const newRenderNode = new RenderNode(child)
        newRenderNode.parent = renderNode

        if(preChildRenderNode){
            preChildRenderNode.sibling = newRenderNode
        }
        preChildRenderNode = newRenderNode

        newChildren.push(newRenderNode)
    })
    renderNode.children = newChildren
}

function getNextRenderNode(renderNode){
    return renderNode.children?.[0] ?? renderNode.sibling ?? renderNode.parent.sibling
}

function commitDomMount(){
    let curRenderNode = rootRenderNode
    while(curRenderNode){
        const { dom } = curRenderNode
        if(dom){
            let parentNode = curRenderNode.parent
            while(!parentNode?.dom){
                parentNode = parentNode.parent
            }
            parentNode?.dom?.append(dom)
        }
        curRenderNode = getNextRenderNode(curRenderNode)
    }
    rootRenderNode = null
}

function performanceRenderUnite(renderNode) {
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