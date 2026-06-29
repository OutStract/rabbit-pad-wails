import { dom } from "../main"
class StartupView{
    view() {
        const startupView = dom.createElement({
            tag: "div",
            className: "startup",
            name: "Startup Container",
            parent: "#app"
        })

        const logoContainer = dom.createElement({
            tag: "div",
            className: "logo",
            id: "logo",
            parent: ".startup"
        })

        const logo = dom.createGraphic({
            tag: "img",
            className: "logo-graphic",
            src: "/src/assets/images/logo.svg",
            alt: "Rabbit Logo",
            parent: "#logo"
        })

        const rightSide = dom.createElement({
            tag: "div",
            className: "start-r-side",
            id: "start-r-side",
            name: "Startup operations",
            parent: ".startup"
        })

        const name = dom.createElement({
            tag: "div",
            className: "rabbit-pad",
            id: "rabbit-pad",
            parent: "#start-r-side"
        })

        const libraryOperations = dom.createElement({
            tag: "div",
            className:"library-operations",
            id: "library-operations",
            parent: "#right-r-side"
        })

        const libraryName = dom.createElement({
            tag: "div",
            className: "msg-container",
            parent: "#library-operations"
        })

        const message1 = dom.createElement({
            tag: "p",
            className: "msg",
            parent: "msg-container"
        })

        const libraryInput = dom.createInput({
            tag: "input",
            className: "lib-name-startup-input",
            parent: "msg-container",
            placeHolder: "Library name"
        })
    }
}

export const startupView = new StartupView()