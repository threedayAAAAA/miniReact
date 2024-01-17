export function updateProps(renderNode){
    Object.entries(renderNode.vdom.props).forEach(([key, val]) => {
        if(key === 'children'){
            return
        }
        renderNode.dom[key] = val
    })
}