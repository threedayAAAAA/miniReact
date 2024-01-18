import { runTask } from './WorkLoop.js'
import { RenderNode, getNextRenderNode } from './RenderNode.js'
import { createElement } from './createDom.js'
import { updateComponent } from './component.js'

function createRootRenderNode(vdom, container){
    const res = new RenderNode(vdom)
    res.parent = new RenderNode({}, container)
    return res
}

let rootRenderNode = null
let nextRenderNode = null
let preRootRenderNode = null
export const __GLOBAL_OBJ = {
    needDeleteRenderNodes: []
}
function render(vdom, container) {
    rootRenderNode = createRootRenderNode(vdom, container)
    nextRenderNode = rootRenderNode
    runTask(() => {
        if(nextRenderNode){
            nextRenderNode = performanceRenderUnite(nextRenderNode)
        }
    })
}

function performanceRenderUnite(renderNode) {
    // 更新组件
    updateComponent(renderNode)

    // 返回要执行的下一个任务
    const nextNextRenderNode = getNextRenderNode(renderNode)

    // 统一执行dom的挂载
    if(!nextNextRenderNode){
        commitDomMount()
    }

    return nextNextRenderNode
}

function commitDomMount(){
    deleteWork(__GLOBAL_OBJ.needDeleteRenderNodes)
    commitWork(rootRenderNode)
    preRootRenderNode = rootRenderNode
    rootRenderNode = null
    __GLOBAL_OBJ.needDeleteRenderNodes = []
}

function commitWork(renderNode){
    let curRenderNode = renderNode
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
}

function deleteWork(needDeleteRenderNodes){
    needDeleteRenderNodes.forEach(renderNode => {
        const { dom } = renderNode
        if(!dom){
            return
        }
        let parent = renderNode.parent
        let parentDom = parent.dom
        while(!parentDom && parent){
            parentDom = parent.dom
            parent = parent.parent
        }
        parentDom.removeChild(dom)
    })
}

function update(){
    rootRenderNode = createRootRenderNode(preRootRenderNode.vdom, preRootRenderNode.parent.dom)
    rootRenderNode.alternate = preRootRenderNode
    nextRenderNode = rootRenderNode
}

const React = {
    render,
    update,
    createElement
}
export default React