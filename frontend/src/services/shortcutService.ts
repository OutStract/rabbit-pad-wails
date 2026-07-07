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
        } else if (event.shiftKey) {
            this.shiftClick(tree, selector, node, cell)
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

    shiftClick(tree: HTMLElement, selector: string, node: LibraryTree, cell: HTMLElement) {
        // Get the cell that user clicked with shift
            if(!this.lastSelectedElement) {
                this.lastSelectedElement = cell
            }

            // Make an array of all the cell in the container with the selector
            const allCells = Array.from(tree.querySelectorAll(selector));

            // Find the index of the first cell user slected
            const startIdx = allCells.indexOf(this.lastSelectedElement)

            // Make a const with the last clicked element from the user
            const endClicked = cell
            const endIdx = allCells.indexOf(endClicked)

            // Find which clicked cell has the smaller and bigger index number
            const minIdx = Math.min(startIdx, endIdx);
            const maxIdx = Math.max(startIdx, endIdx);

            // Clean the tree of previous cells
            tree.querySelectorAll('.selected').forEach(el => {
                el.classList.remove('selected')
            })
            
            // Loop through each element in the array 
            for(let i = minIdx ; i <= maxIdx ; i++) {
                const currentCell = allCells[i]
                // FInd the element in the dom

                if(currentCell) {
                    this.set.add(node)
                    currentCell.classList.add("selected");
                }
            }
    }
}

export const domEvents = new ShortcutService()