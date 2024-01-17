import { runTask } from './WorkLoop.js'
import { RenderNode, getNextRenderNode } from './RenderNode.js'
import { createElement } from './createDom.js'
import { updateComponent } from './component.js'

let rootRenderNode = null
function render(vdom, container) {
    rootRenderNode = new RenderNode(vdom)
    rootRenderNode.parent = new RenderNode({}, container)
    let nextNode = rootRenderNode
    runTask(() => {
        if(nextNode){
            nextNode = performanceRenderUnite(nextNode)
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

const React = {
    render,
    createElement
}
export default React