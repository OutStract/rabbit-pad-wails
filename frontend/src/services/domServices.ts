import { ElementData, GraphicElement, InputElement } from "../types/element"

export class Dom {
    app: HTMLElement 
    constructor(appElement: HTMLElement) {
        this.app = appElement
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
        element.id = data.id ?? ""
        element.dataset.name = data.name ?? ""
        element.dataset.placement = data.placement ?? ""
        element.dataset.area = data.area ?? ""
        element.dataset.type = data.type ?? ""
        element.dataset.text = data.text ?? ""
        element.dataset.draggable = data.draggable ?? "false"
        element.dataset.focus = data.focus ?? "false"
        element.dataset.path = data.path ?? ""
        element.dataset.parent = data.parent ?? ""
        if(data.parent) {
            const parentElement = document.querySelector(data.parent)
            parentElement?.append(element)
        }
        return element
    }

    createGraphic(data: GraphicElement) {
        const graphic = this.createElement({
            tag: data.tag,
            className: data.className,
            parent: data.parent
        }) as HTMLImageElement

        graphic.src = data.src
        graphic.alt = data.alt ?? ""
        return graphic
    }

    createInput(data: InputElement) {
        const input = this.createElement({
            tag: data.tag,
            className: data.className,
            parent: data.parent
        }) as HTMLInputElement

        input.placeholder = data.placeHolder ?? ""
        return input
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

