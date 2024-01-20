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
    commitEffect(rootRenderNode)
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

function commitEffect(renderNode){
    let curRenderNode = renderNode
    while(curRenderNode){
        const { effectHook, alternate } = curRenderNode ?? {}
        curRenderNode = getNextRenderNode(curRenderNode)
        if(!effectHook){
            return
        }
        // update
        if(alternate){
            const { deps } = effectHook
            const { deps: oldDeps } = alternate.effectHook
            deps.forEach((dep, index) => {
                if(dep !== oldDeps[index]){
                    effectHook?.callBack()
                }
            })
        } else {
        // init
            effectHook?.callBack()
        }
    }
}

function update(){
    let currentRootNode = __GLOBAL_OBJ.wipRootRender
    return () => {
        rootRenderNode = createRootRenderNode(currentRootNode.vdom, currentRootNode.parent.dom)
        rootRenderNode.alternate = currentRootNode
        nextRenderNode = rootRenderNode
    }
}

function isFunction(data){
    return typeof data === 'function'
}

const useState = (initial) => {
    const currentFunctionNode = __GLOBAL_OBJ.wipRootRender
    const oldStateHook = currentFunctionNode?.alternate?.stateHooks?.[__GLOBAL_OBJ.stateHookIndex]
    const stateHook = {
        state: oldStateHook?.state ?? initial,
        queue: oldStateHook?.queue ?? []
    }
    __GLOBAL_OBJ.stateHookIndex++
    __GLOBAL_OBJ.stateHooks.push(stateHook)
    currentFunctionNode.stateHooks = __GLOBAL_OBJ.stateHooks

    stateHook.queue.forEach(action => {
        stateHook.state = isFunction(action) ? action(stateHook.state) : action
    })
    
    const setState = (action) => {
        const eagerState = isFunction(action) ? action(stateHook.state) : action
        if(eagerState === stateHook.state){
            return
        }
        stateHook.queue.push(isFunction(action) ? action : () => action)

        rootRenderNode = createRootRenderNode(currentFunctionNode.vdom, currentFunctionNode.parent.dom)
        rootRenderNode.alternate = currentFunctionNode
        nextRenderNode = rootRenderNode
    }
    return [stateHook.state, setState]
}

const useEffect = (callBack, deps) => {
    const effectHook = {
        callBack,
        deps
    }
    __GLOBAL_OBJ.wipRootRender.effectHook = effectHook
}

const React = {
    render,
    update,
    createElement,
    useState,
    useEffect
}
export default React