import { ButtonElement, ElementData, GraphicElement, InputElement } from "../types/element"

class Dom {

    getElement(selector: string): HTMLElement | null {
        const element = document.querySelector(selector)
        if(!element) {
            console.log("Cannot get element", selector)
            return null
        }
        return element as HTMLElement
    }

    createElement(data: ElementData): HTMLElement {
        const element = document.createElement(data.tag)
        element.classList.add(data.className ?? "")
        element.id = data.id ?? ""
        element.dataset.name = data.name ?? ""
        element.dataset.placement = data.placement ?? ""
        element.dataset.area = data.area ?? ""
        element.dataset.type = data.type ?? ""
        element.innerText = data.text ?? ""
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
            className: data.className ?? "user-input",
            parent: data.parent
        }) as HTMLInputElement

        input.placeholder = data.placeHolder ?? ""
        return input
    }

    createButton(data: ButtonElement) {
        const button = this.createElement({
            tag: data.tag,
            className: data.className ?? "regular-button",
            parent: data.parent,
            text: data.text
        }) as HTMLInputElement

        button.disabled = data.disabled ?? false
        return button
    }

    createIcon(name: string) {
        const iconContainer = this.createElement({
            tag: "div",
            className: "icon-container"
        })

        const iconGraphic = this.createElement({
            tag: "span",
            className: "material-symbols-outlined",
            text: name,
        })

        this.addClass("icon", iconGraphic)

        iconContainer.append(iconGraphic)

        return iconContainer
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

export const DOM = new Dom()