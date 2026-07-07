import './libraryView.css'

import { DOM } from "../services/domServices";
import { appState } from "../services/stateServices";
import { EventsOn } from '../../wailsjs/runtime/runtime';
import * as EVENT from '../events/events.ts'
import { projectServices } from "../services/projectServices.ts"
import { domEvents } from '../services/shortcutService.ts';


export class LibraryView {
    private dom = DOM;
    private service = projectServices
    
    build() {
        this.libraryOperations()    
        this.libraryTree()
        this.metadataPane()

        // Editing the tree elements
        this.appendProject()
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
        createNewProject.addEventListener('click', () => {
            const libNameInput = this.dom.createInput({
                tag: "input",
                type: "text",
                className: "lt-project-name-input",
                placeHolder: "Project name"
            })

            const createBtn = this.dom.createButton({
                tag: "button",
                className: "action-button",
                text: "Create Project"
            })

            createBtn.addEventListener('click', async () => {
                const name = libNameInput.value
                await this.service.makeProject(name)
                const modal = this.dom.getElement(".lt-modal")
                if(!modal) return
                modal.remove()

            })

            const elements = [
                libNameInput,
                createBtn,
            ]

            this.dom.createModal("lt", elements)
        })

        const deleteProject = this.dom.createIcon("delete")

        libraryOperations.append(createNewProject, deleteProject)
    }

    appendProject() {
        EventsOn(EVENT.MAKE_PROJECT, (data) => {
            this.dom.createTreeNode(
                "lt",
                ".lt-tree-container",
                data.path,
                "book_2",
                data.name,
            )
        })
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

            const libNode = this.dom.createTreeNode(
                "lt",
                ".lt-tree-container",
                node.path,
                "book_2",
                node.name,
            )
            libNode.addEventListener('click', (event) => {
                domEvents.select(treeContainer, ".lt-node-block", node, libNode, event)
            })

        });
    }

    metadataPane() {
        const middle = this.dom.getElement(".rp-middle-pane")
        if(!middle) return
        
        const middleContainer = this.dom.createElement({
            tag: "div",
            className: "lt-middle-container"
        })

        const middleTop = this.dom.createElement({
            tag: "div",
            className: "lt-middle-top"
        }, true)

        const middleBottom = this.dom.createElement({
            tag: "div",
            className: "lt-middle-bottom"
        }, true)

        middleContainer.append(middleTop, middleBottom)

        middle.append(middleContainer)

        const topLeft = this.dom.createElement({
            tag: "div",
            className: "lt-top-left"
        }, true)


        const topRight = this.dom.createElement({
            tag: "div",
            className: "lt-top-right"
        }, true)

        middleTop.append(topLeft, topRight)

        const bottomLeft = this.dom.createElement({
            tag: "div",
            className: "lt-bottom-right"
        }, true)

        const bottomRight = this.dom.createElement({
            tag: "div",
            className: "lt-bottom-right"
        }, true)

        middleBottom.append(bottomLeft, bottomRight)

        const coverBlock = this.dom.createElement({
            tag: "div",
            className: "cover-block"
        })

        topLeft.append(coverBlock)
    }
}

export const renderLibrary = new LibraryView()