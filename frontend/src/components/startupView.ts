
import { Dom } from '../services/domServices';
import { startupServices, StartUpServices } from '../services/startupServices';
import './startupView.css'

export class StartupView{
    constructor(
        private dom: Dom
    ) {}
    view() {
        const startupView = this.dom.createElement({
            tag: "div",
            className: "rp-card-startup",
            name: "Startup Container",
            parent: "#app"
        })
        console.log(startupView)

        const logoContainer = this.dom.createElement({
            tag: "div",
            className: "rp-container-logo",
            parent: ".rp-card-startup"
        })

        const logo = this.dom.createGraphic({
            tag: "img",
            className: "rp-logo-graphic",
            src: "/src/assets/images/logo.svg",
            alt: "Rabbit Logo",
            parent: ".rp-container-logo"
        })

        const rightSide = this.dom.createElement({
            tag: "div",
            className: "rp-startup-right",
            name: "Startup operations",
            parent: ".rp-card-startup"
        })

        const name = this.dom.createElement({
            tag: "div",
            className: "rp-title",
            parent: ".rp-startup-right",
            text: "Rabbit-pad"
        })

        const libraryOperations = this.dom.createElement({
            tag: "div",
            className:"rp-startup-operations",
            parent: ".rp-startup-right"
        })

        const libraryName = this.dom.createElement({
            tag: "div",
            className: "rp-startup-name-input",
            parent: ".rp-startup-operations"
        })

        const message1 = this.dom.createElement({
            tag: "p",
            className: "rp-user-direction",
            parent: ".rp-startup-name-input",
            text: "Enter your library name"
        })

        const libraryInput = this.dom.createInput({
            tag: "input",
            parent: ".rp-startup-name-input",
            placeHolder: "Library name"
        })

        const libraryLocation = this.dom.createElement({
            tag: "div",
            className: "rp-startup-location-input",
            parent: ".rp-startup-operations"
        })

        const locationContainer = this.dom.createElement({
            tag: "div",
            className: "rp-location-container",
            parent: ".rp-startup-location-input"
        })

        const message2 = this.dom.createElement({
            tag: "p",
            className: "rp-user-direction",
            text: "Select library location",
            parent: ".rp-location-container"
        })

        const locationText = this.dom.createElement({
            tag: "p",
            className: "rp-user-location",
            text: "",
            parent: ".rp-location-container"
        })

        const libraryLocationInput = this.dom.createButton({
            tag: "button",
            parent: ".rp-startup-location-input",
            text: "Browse"
        })

        libraryLocationInput.addEventListener("click", async () => {
            const result = await startupServices.openDirectory()
            locationText.innerText = result as string
        })

        const libraryCreate = this.dom.createElement({
            tag: "div",
            className: "rp-startup-create-input",
            parent: ".rp-startup-operations"
        })

        const message3 = this.dom.createElement({
            tag: "p",
            text: "Create your library",
            className: "rp-user-direction",
            parent: ".rp-startup-create-input"
        })

        const libraryCreateBtn = this.dom.createButton({
            tag: "button",
            parent: ".rp-startup-create-input",
            text: "Create"
        })

        
        const createLibrary = async () => {
            const libName = libraryInput.value
            const libPath = locationText.innerText
            if (!libName || !libPath) {
                alert ("Name or Path Can't be empty")
                return
            }
            const result = await startupServices.updateConfig(libName, libPath)
            libraryCreateBtn.removeEventListener("close", createLibrary)
            libraryCreateBtn.addEventListener("click", createLibrary)
        }
        libraryCreateBtn.addEventListener("click", createLibrary)

    }
}