import { appState } from "./stateServices";
import { DOM } from "../services/domServices";
import { LibraryTree } from "../types/trees";


class ShortcutService {
    lastSelectedElement: null | HTMLElement = null;
    private dom = DOM;
    private get set() {
        return appState.selectedFiles
    }
    constructor() {
        window.addEventListener('keydown', (event) => {this.shortcuts(event)})
    }

    select(tree: HTMLElement, selector: string, node: LibraryTree, cell: HTMLElement, event: KeyboardEvent | MouseEvent) {
        if(event.ctrlKey) {
            this.ctrlClick(node, cell)
        } else {
            this.cellClick(tree, selector, node, cell)
        }
    }

    shortcuts(event: KeyboardEvent) {
        if(event.key === 'Delete') {
        }

        if (event.ctrlKey && event.key.toLowerCase() === 'r') {
        }
    }

    cellClick(tree: HTMLElement, selector: string, node: LibraryTree, cell: HTMLElement) {
        this.set.clear()
        tree.querySelectorAll(selector).forEach(el => {
            this.dom.removeClass("selected", el as HTMLElement)
        })
        this.set.add(node)
        this.dom.addClass("selected", cell)
        this.lastSelectedElement = cell
    }

    ctrlClick(node: LibraryTree, cell: HTMLElement) {
        if(this.set.has(node)) {
            this.set.delete(node)
            this.dom.removeClass("selected", cell)
            console.log(node)

        } else {
            this.set.add(node)
            this.dom.addClass("selected", cell)
            this.lastSelectedElement = cell
            
        }
    }

    shiftClick() {
        
    }
}

export const domEvents = new ShortcutService()