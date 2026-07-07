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

    createElement(data: ElementData, border?: boolean): HTMLElement {
        const element = document.createElement(data.tag)
        element.classList.add(data.className ?? "")
        element.id = data.id ?? ""
        element.dataset.name = data.name ?? ""
        element.dataset.placement = data.placement ?? ""
        element.dataset.area = data.area ?? ""
        element.innerText = data.text ?? ""
        element.dataset.draggable = data.draggable ?? "false"
        element.dataset.focus = data.focus ?? "false"
        element.dataset.path = data.path ?? ""
        element.dataset.parent = data.parent ?? ""
        element.tabIndex = data.tabIndex ?? 1  
        if(data.parent) {
            const parentElement = document.querySelector(data.parent)
            parentElement?.append(element)
        }
        if(border) {
            element.style.border = "solid 2px"
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
            className: data.className ?? "",
            parent: data.parent
        }) as HTMLInputElement

        input.placeholder = data.placeHolder ?? ""
        input.type = data.type ?? ""
        this.addClass("user-input", input)
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
            tabIndex: -1,
        })

        this.addClass("icon", iconGraphic)

        iconContainer.append(iconGraphic)

        return iconContainer
    }

    createTreeNode(categoryClass: string, parent: string, path: string, icon: string, nodeName: string): HTMLElement {
        const nodeBlock = this.createElement({
            tag: "div",
            className: `${categoryClass}-node-block`,
            parent: parent,
            path: path
        })

        const nodeIcon = this.createIcon(icon)
        nodeIcon.tabIndex = -1

        this.addClass("node-icon", nodeIcon)

        const nodeNameElement = this.createElement({
                tag: "p",
                className: `${categoryClass}-node-name`,
                text: nodeName,
                tabIndex: -1
            })


        nodeBlock.append(nodeIcon, nodeNameElement)

        return nodeBlock
    }

    createModal(categoryClass: string, elements: Array<HTMLElement>) {
        const modalExist = document.querySelector(".modal")
        if(modalExist) {
            console.log(modalExist)
            return
        }
        const modal = this.createElement({
            tag: "div",
            className: `${categoryClass}-modal`,
            parent: "#app",
        })

        const modalHeader = this.createElement({
            tag: "div",
            className: `${categoryClass}-modal-header`,
        })
        const closeModal = this.createIcon("close")

        closeModal.addEventListener("click", () => {
            modal.remove()
        })

        const modalElements = this.createElement({
            tag: "div",
            className: `${categoryClass}-modal-elements`,
            parent: "#app",
        })

        this.addClass("modal-header", modalHeader)

        this.addClass("modal", modal)

        this.addClass("modal-elements", modalElements)

        modalHeader.append(closeModal)
        modal.append(modalHeader, modalElements)

        elements.forEach(element => {
            modalElements.append(element)
        })

        return modal
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