import { DOM } from "../services/domServices";

class Footer {
    dom = DOM

    build() {
        const footer = this.dom.getElement(".rp-footer-body")
    }
}

export const renderFooter = new Footer()

