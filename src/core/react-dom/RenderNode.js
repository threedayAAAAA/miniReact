export class RenderNode{
    container
    vdom
    parent
    sibling
    children
    el
    constructor(vdom, container, el){
        this.vdom = vdom
        this.container = container
        this.el = el
    }
}
