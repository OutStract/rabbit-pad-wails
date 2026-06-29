
interface ElementData {
    tag: string;
    className: string;
    name?: string;
    placement?: string;
    area?: string;
    type?: string;
    text?: string;
    draggable?: string;
    focus?: string;
    path?: string;
    parent?: string;
    placeHolder?: string;
}

class Dom {
    app: HTMLElement
    constructor(app: HTMLElement) {
        this.app = app
    }

    appendToApp(className: string) {
        const element = document.querySelector(className)
        if(!element) {
            console.log(`Could not find element: ${className}`)
            return
        }
        element.classList.add(className)
        this.app.append(element)
    }

    createElement(data: ElementData): HTMLElement {
        const element = document.createElement(data.tag)
        element.classList.add(data.className)
        element.dataset.name = data.name ?? ""
        element.dataset.placement = data.placement ?? ""
        element.dataset.area = data.area ?? ""
        element.dataset.type = data.type ?? ""
        element.dataset.text = data.text ?? ""
        element.dataset.draggable = data.draggable ?? "false"
        element.dataset.focus = data.focus ?? "false"
        element.dataset.path = data.path ?? ""
        element.dataset.parent = data.parent ?? ""
        element.dataset.placeHolder = data.placeHolder ?? ""
        if(data.parent) {
            const parentElement = document.querySelector(data.parent)
            parentElement?.append(element)
        }
        return element
    }

    remove(element: HTMLElement) {
        element.remove()
    }

    addClass(newClass: string, element: HTMLElement) {
        element.classList.add(newClass)
    }

    removeClass(removeClass: string, element: HTMLElement) {
        element.classList.remove(removeClass)
    }

}