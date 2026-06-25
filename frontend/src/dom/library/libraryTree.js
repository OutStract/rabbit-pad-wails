import {events, emit, ON} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'
import { getName } from '../../Labours/splitLabour'



export function renderLibraryTree() {
    
    const libraryBody = get("libraryTree.js","library", "libraryBody")
    
    const libraryTreeContainer = document.createElement("div");
    libraryTreeContainer.id = "library-tree-container"
    register("library", "libraryTreeContainer", libraryTreeContainer)

    libraryBody.append(libraryTreeContainer)

    loadLibraryTree()

}

async function loadLibraryTree () {

    const container = get("libraryTree.js function: loadLibraryTree","library", "libraryTreeContainer")

    const newProjectBlock = document.createElement("div");
    newProjectBlock.id = "new-project-block"
    const newProjectText = document.createElement("p")
    newProjectText.textContent = "New Project"
    newProjectText.classList.add("new-project-text")
    const newProjectBtn = document.createElement("span");
    newProjectBtn.classList.add("material-symbols-outlined", "new-project-btn");
    newProjectBtn.textContent = "add_box";

    newProjectBtn.addEventListener("click", () => {
        const payload = {
                    source: "libraryTree.js",
                    data: null,
        }
        emit(events.project.req.create, payload);
        
    })

    newProjectBlock.append(newProjectBtn, newProjectText)

    container.append(newProjectBlock)

    const libRoot = appstate.library.path
    const nodes = await libraryServices.LIB_TREE("main.js",libRoot)
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

            await libraryServices.UPDATE_LIB_CONFIG("libraryTree.js",libPath, projectPath)
            const payload = {
                    source: "libraryTree.js",
                    data: null,
                }
            emit(events.project.req.open, payload);
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

ON(events.project.res.created, {callback: addNewProject})

function addNewProject() {
    const container = get("libraryTree.js","library", "libraryTreeContainer")

    const newNodePath = appstate.project.newProjectPath
    // const nameExtractions = newNodePath.split(/[\\/]/);
    const newNodeName = getName(newNodePath)

    const libraryNode = document.createElement("div")
        libraryNode.id = "library-node";
        libraryNode.dataset.path = newNodePath

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

            await libraryServices.UPDATE_LIB_CONFIG("libraryTree.js",libPath, projectPath)
            const payload = {
                    source: "libraryTree.js",
                    data: null,
                }
            emit(events.project.req.open, payload);
        })

        nodeImage.addEventListener("mouseleave", () => {
            nodeImage.textContent = "folder";
        })

        const nodeName = document.createElement("p")
        nodeName.textContent = newNodeName
        nodeName.classList.add("lib-project-name")

        libraryNode.append(nodeImage, nodeName)
}