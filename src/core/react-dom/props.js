export function updateProps(renderNode){
    Object.entries(renderNode.vdom.props).forEach(([key, val]) => {
        if(key === 'children'){
            return
        }
        if(isEventKey(key)){
            // todo 移除旧的函数
            bindEvent(renderNode.dom, getEventName(key), val, renderNode.alternate?.vdom.props[key])
            return
        }
        renderNode.dom[key] = val
    })
}

function isEventKey (key) {
    return typeof key === 'string' && key.slice(0, 2).toLocaleLowerCase() === 'on'
}

function getEventName(key){
    return key.slice(2).toLocaleLowerCase()
}

function bindEvent(dom, eventName, handler, oldHandler){
    dom?.addEventListener(eventName, handler)
}
