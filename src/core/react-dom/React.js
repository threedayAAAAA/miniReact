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
export const __GLOBAL_OBJ = {
    wipRootRender: null,
    needDeleteRenderNodes: [],
    stateHooks: [],
    stateHookIndex: 0
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
    rootRenderNode = null
    __GLOBAL_OBJ.needDeleteRenderNodes = []
}

function commitWork(renderNode){
    let curRenderNode = renderNode
    while(curRenderNode){
        const { dom, effectTag } = curRenderNode
        if(dom){
            let parentNode = curRenderNode.parent
            while(!parentNode?.dom){
                parentNode = parentNode.parent
            }
            
            if(effectTag === 'placement'){
                parentNode?.dom?.append(dom)
            } else if(!parentNode?.dom?.hasChildNodes(dom)){
                parentNode?.dom?.append(dom)
            }
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
    let currentRootNode = __GLOBAL_OBJ.wipRootRender
    return () => {
        rootRenderNode = createRootRenderNode(currentRootNode.vdom, currentRootNode.parent.dom)
        rootRenderNode.alternate = currentRootNode
        nextRenderNode = rootRenderNode
    }
}


const useState = (initial) => {
    const currentFunctionNode = __GLOBAL_OBJ.wipRootRender
    const oldNode = currentFunctionNode?.alternate
    // stateHooks[stateHookIndex]
    // const stateHook = {
    //     state: oldNode?.stateHook.state ?? initial
    // }
    const stateHook = oldNode?.stateHooks?.[__GLOBAL_OBJ.stateHookIndex] ?? {
        state: initial
    }
    __GLOBAL_OBJ.stateHookIndex++
    __GLOBAL_OBJ.stateHooks.push(stateHook)
    currentFunctionNode.stateHooks = __GLOBAL_OBJ.stateHooks
    
    const setState = (action) => {
        stateHook.state = action(stateHook.state)

        const nextRenderFunctionNode = createRootRenderNode(currentFunctionNode.vdom)
        nextRenderFunctionNode.alternate = currentFunctionNode
        nextRenderNode = nextRenderFunctionNode
    }
    return [stateHook.state, setState]
}

const React = {
    render,
    update,
    createElement,
    useState
}
export default React