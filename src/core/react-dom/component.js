import { createDom } from './createDom.js'
import { updateProps } from './props.js'
import { RenderNode } from './RenderNode.js'

export function updateComponent(renderNode){
    // 1. create
    // 2. props
    // 3. 根据children的指针,生成渲染任务的链表结构
    if(isFunctionComponent(renderNode.vdom)){
        updateFunctionComponent(renderNode)
    } else {
        updateHostComponent(renderNode)
    }
}

function isFunctionComponent(vdom) {
    return typeof vdom.type === 'function' 
}

function updateFunctionComponent(renderNode){
    renderNode.vdom.props.children = [renderNode.vdom.type(renderNode.vdom.props)]
    initChild(renderNode)
}

function updateHostComponent(renderNode){
    // 1. create
    createDom(renderNode)

    // 2. props
    updateProps(renderNode)

    // 3. 根据children的指针,生成渲染任务的链表结构
    initChild(renderNode)
}


function initChild(renderNode){
    const { vdom: { props } } = renderNode
    const newChildren = []
    let preChildRenderNode
    props.children?.forEach(child => {
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