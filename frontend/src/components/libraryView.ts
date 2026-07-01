import './libraryView.css'

import { DOM } from "../services/domServices";
import { appState } from "../services/stateServices";
import { EventsOn } from '../../wailsjs/runtime/runtime';
import * as EVENT from '../events/events.ts'

export class LibraryView {
    constructor(
        private dom = DOM,
    ) {}
    
    build() {    
        this.libraryOperations()    
        this.libraryTree()
        this.userActions()
    }

    libraryOperations() {
        const leftPane = this.dom.getElement(".rp-left-pane")
        if(!leftPane) return

        const libraryOperations = this.dom.createElement({
            tag: "div",
            className: "lt-operations-panel"
        })

        leftPane.append(libraryOperations)

        const createNewProject = this.dom.createIcon("add_box")
        const deleteProject = this.dom.createIcon("delete")

        libraryOperations.append(createNewProject, deleteProject)
    }
    
    libraryTree() {
        const leftPane = this.dom.getElement(".rp-left-pane")
        const libraryTree = appState.libraryTree

        if(!leftPane || !libraryTree) return

        const treeContainer = this.dom.createElement({
            tag: "div",
            className: "lt-tree-container",
        })

        leftPane.append(treeContainer)

        libraryTree.forEach(node => {
            const nodeBlock = this.dom.createElement({
                tag: "div",
                className: "lt-node-block",
                parent: ".lt-tree-container"
            })

            const nodeIcon = this.dom.createIcon("book_2")

            this.dom.addClass("lt-node-icon", nodeIcon)

            const nodeName = this.dom.createElement({
                tag: "p",
                className: "lt-node-name",
                text: node.name
            })

            nodeBlock.append(nodeIcon, nodeName)
        });

        const openProject = async () => {

        }
    }

    userActions() {
        const middle = this.dom.getElement(".rp-middle-pane")
        if(!middle) return

    }
}

export const renderLibrary = new LibraryView()