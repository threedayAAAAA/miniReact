export class RenderNode {
    vdom
    dom
    parent
    sibling
    children
    alternate
    effectTag
    constructor(vdom, dom){
        this.vdom = vdom
        this.dom = dom
    }
}

export function getNextRenderNode(renderNode){
    if(renderNode.children?.[0]){
        return renderNode.children?.[0]
    }
    let nextNode = renderNode;
    while (nextNode) {
        if (nextNode.sibling) return nextNode.sibling;
        nextNode = nextNode.parent;
    }
    return nextNode
}