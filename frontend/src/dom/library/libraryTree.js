import {events, emit} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'



export function renderLibraryTree() {
    const libraryBody = get("library", "libraryBody")
    
    const libraryTreeContainer = document.createElement("div");
    libraryTreeContainer.id = "library-tree-container"
    register("library", "libraryTreeContainer", libraryTreeContainer)

    libraryBody.append(libraryTreeContainer)

    loadLibraryTree()

}

async function loadLibraryTree () {

    const libRoot = appstate.library.path
    const nodes = await libraryServices.LIB_TREE("main.js",libRoot)
    const container = get("library", "libraryTreeContainer")
    container.replaceChildren()

    const newProjectBlock = document.createElement("div");
    newProjectBlock.id = "new-project-block"
    const newProjectText = document.createElement("p")
    newProjectText.textContent = "New Project"
    newProjectText.classList.add("new-project-text")
    const newProjectBtn = document.createElement("span");
    newProjectBtn.classList.add("material-symbols-outlined", "new-project-btn");
    newProjectBtn.textContent = "add_box";

    newProjectBtn.addEventListener("click", () => {
        emit(events.NEW_PROJECT);
        
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
        nodeImage.addEventListener("click", async () => {
            const projectPath = libraryNode.dataset.path;
            const libPath = appstate.library.path

            await libraryServices.UPDATE_LIB_CONFIG(libPath, projectPath)
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