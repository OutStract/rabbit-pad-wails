import { DOM } from "../services/domServices";
import { appState } from "../services/stateServices";

class AppBody {
    dom = DOM
    
    build() {
        this.header()
        this.content()
        this.leftPane()
        this.middle()
        this.rightPane()
        this.Footer()
    }
    header() {
        const headerBody = this.dom.createElement({
            tag: "div",
            className: "rp-header-body",
            name: "Header",
            parent: "#app"
        })
        return headerBody
    }

    content() {
        const contentBody = this.dom.createElement({
            tag: "div",
            className: "rp-content-body",
            name: "Content-Body",
            parent: "#app"
        })
        return contentBody
    }

    leftPane() {
        const leftPane = this.dom.createElement({
            tag: "div",
            className: "rp-left-pane",
            name: "left-pane",
            parent: ".rp-content-body"
        })

        if(!appState.leftPaneCollapsed) {
            this.dom.addClass("isHidden", leftPane)
        } else {
            this.dom.removeClass("isHidden", leftPane)
        }
        
        return leftPane
    }

    middle() {
        const middle = this.dom.createElement({
            tag: "div",
            className: "rp-middle-pane",
            name: "middle-pane",
            parent: ".rp-content-body"
        })
        return middle
    }

    rightPane() {
        const rightPane = this.dom.createElement({
            tag: "div",
            className: "rp-right-pane",
            name: "right-pane",
            parent: ".rp-content-body"
        })

        if(!appState.rightPaneCollapsed) {
            this.dom.addClass("isHidden", rightPane)
        } else {
            this.dom.removeClass("isHidden", rightPane)
        }
        return rightPane
    }

    Footer() {
        const headerBody = this.dom.createElement({
            tag: "div",
            className: "rp-footer-body",
            name: "footer",
            parent: "#app"
        })
        return headerBody
    }
}

export const appBody = new AppBody()