export class RenderNode{
    container
    vdom
    dom
    parent
    sibling
    children
    constructor(vdom, container, dom){
        this.vdom = vdom
        this.container = container
        this.dom = dom
    }
}
