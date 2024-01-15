export class RenderNode {
    vdom
    dom
    parent
    sibling
    children
    constructor(vdom, dom){
        this.vdom = vdom
        this.dom = dom
    }
}
