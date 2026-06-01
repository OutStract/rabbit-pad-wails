import { EventsEmit } from '../../../../wailsjs/runtime/runtime';
import { EventsOn } from '../../../../wailsjs/runtime/runtime';
import { appState } from '../../cache.js'



export function renderLibraryTree(libraryBody, libraryNodes, UpdateLibConfig) {
    const libraryTreeContainer = document.createElement("div");
    libraryTreeContainer.id = "library-tree-container"
    libraryBody.append(libraryTreeContainer)

    loadLibraryTree(libraryNodes, libraryTreeContainer, UpdateLibConfig)

}

function loadLibraryTree (nodes, container, UpdateLibConfig) {


    const newProjectBlock = document.createElement("div");
    newProjectBlock.id = "new-project-block"
    const newProjectText = document.createElement("p")
    newProjectText.textContent = "New Project"
    newProjectText.classList.add("new-project-text")
    const newProjectBtn = document.createElement("span");
    newProjectBtn.classList.add("material-symbols-outlined", "new-project-btn");
    newProjectBtn.textContent = "add_box";
    newProjectBtn.addEventListener("click", () => {
        EventsEmit("new-project");
        
    })

    newProjectBlock.append(newProjectBtn, newProjectText)

    container.append(newProjectBlock)

    nodes.forEach(node => {

        const libraryNode = document.createElement("div")
        libraryNode.id = "library-node";
        libraryNode.dataset.path = node.path

        container.append(libraryNode)

        const nodeImage = document.createElement("span")
        nodeImage.classList.add("material-symbols-outlined");
        nodeImage.textContent = "folder";
        nodeImage.classList.add("project-folder-icon")
        nodeImage.addEventListener("mouseenter", () => {
            nodeImage.textContent = "folder_open";
        })
        nodeImage.addEventListener("click", () => {
            const projectPath = libraryNode.dataset.path;
            const libPath = appState.libraryPath
            UpdateLibConfig(libPath, projectPath)
            EventsEmit("open-project", projectPath);
        })

        nodeImage.addEventListener("mouseleave", () => {
            nodeImage.textContent = "folder";
        })

        const nodeName = document.createElement("p")
        nodeName.textContent = node.name
        nodeName.classList.add("lib-project-name")

        libraryNode.append(nodeImage, nodeName)

    })
}