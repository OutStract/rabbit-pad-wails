
// import { dom } from "../main"
import { Dom } from '../services/domServices';
import { startupServices, StartUpServices } from '../services/startupServices';


export class StartupView{
    constructor(
        private dom: Dom
    ) {}
    view() {
        const welcome = this.dom.createElement ({
            tag: "div",
            className: "welcome",
            id: "welcome",
            parent: "#app"
        })
        const startupView = this.dom.createElement({
            tag: "div",
            className: "startup",
            name: "Startup Container",
            parent: "#welcome"
        })
        console.log(startupView)

        const logoContainer = this.dom.createElement({
            tag: "div",
            className: "logo",
            id: "logo",
            parent: ".startup"
        })

        const logo = this.dom.createGraphic({
            tag: "img",
            className: "logo-graphic",
            src: "/src/assets/images/logo.svg",
            alt: "Rabbit Logo",
            parent: "#logo"
        })

        const rightSide = this.dom.createElement({
            tag: "div",
            className: "start-r-side",
            id: "start-r-side",
            name: "Startup operations",
            parent: ".startup"
        })

        const name = this.dom.createElement({
            tag: "div",
            className: "rabbit-pad",
            id: "rabbit-pad",
            parent: "#start-r-side",
            text: "Rabbit-pad"
        })

        const libraryOperations = this.dom.createElement({
            tag: "div",
            className:"library-operations",
            id: "library-operations",
            parent: "#start-r-side"
        })

        const libraryName = this.dom.createElement({
            tag: "div",
            className: "msg-container",
            id: "library-name",
            parent: "#library-operations"
        })

        const message1 = this.dom.createElement({
            tag: "p",
            className: "msg",
            parent: ".msg-container",
            text: "Enter your library name"
        })

        const libraryInput = this.dom.createInput({
            tag: "input",
            className: "lib-name-startup-input",
            parent: "#library-name",
            placeHolder: "Library name"
        })

        const libraryLocation = this.dom.createElement({
            tag: "div",
            className: "msg-container",
            id: "library-location",
            parent: "#library-operations"
        })

        const locationContainer = this.dom.createElement({
            tag: "div",
            className: "location-container",
            parent: "#library-location"
        })

        const message2 = this.dom.createElement({
            tag: "p",
            className: "msg",
            text: "Select library location",
            parent: ".location-container"
        })

        const locationText = this.dom.createElement({
            tag: "p",
            className: "path",
            text: "",
            parent: ".location-container"
        })

        const libraryLocationInput = this.dom.createElement({
            tag: "button",
            className: "start-btn",
            parent: "#library-location",
            text: "Browse"
        })

        libraryLocationInput.addEventListener("click", () => {
            const result = startupServices.openDirectory()
        })

    }
}

