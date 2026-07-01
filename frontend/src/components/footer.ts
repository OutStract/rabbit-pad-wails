import { DOM } from "../services/domServices";

class Footer {
    constructor(
        private dom = DOM
    ) {}

    build() {
        const footer = this.dom.getElement(".rp-footer-body")
    }
}

export const renderFooter = new Footer()

