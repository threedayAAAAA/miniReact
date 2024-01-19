export function updateProps(renderNode){
    const { dom, vdom: { props }, alternate } = renderNode

    // 移除旧的存在,新的不存在
    alternate?.dom && Object.entries(alternate.vdom.props).forEach(([key, val]) => {
        if(key !== 'children'){
            if(!key in props){
                dom.removeAttribute(key)
            }
        }
    })

    // 用新的覆盖旧的
    Object.entries(props).forEach(([key, val]) => {
        if(key !== 'children'){
            if(isEventKey(key)){
                processEvent(dom, getEventName(key), val, alternate?.vdom.props[key])
            } else {
                dom[key] = val
            }
        }
    })
}

function isEventKey (key) {
    return typeof key === 'string' && key.slice(0, 2).toLocaleLowerCase() === 'on'
}

function getEventName(key){
    return key.slice(2).toLocaleLowerCase()
}

function processEvent(dom, eventName, newHandler, oldHandler){
    newHandler && dom?.addEventListener(eventName, newHandler)
    oldHandler && dom?.removeEventListener(eventName, oldHandler)
}