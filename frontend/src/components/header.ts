import { DOM } from "../services/domServices";

class Header {
    constructor(
        private dom = DOM,
    ) {}

    build() {
        const header = this.dom.getElement(".rp-header-body")
        if(!header) return


        const leftPane = this.dom.createIcon("left_panel_close")
        const rightPane = this.dom.createIcon("right_panel_close")


        header.append(leftPane, rightPane)
    }
}

export const renderHeader = new Header()

