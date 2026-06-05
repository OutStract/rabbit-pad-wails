import {events, emit, ON} from '/src/events/events.js'
import {logger} from '/src/logs/logger.js'
import {projectServices} from '/src/api/api.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'
import { appstate } from '/src/appstate/appstate.js'



export async function renderProjectTree() {

    const containerLeft = get("projectTree.js","leftSide", "fileContainer")

        //Project Tree Container
        const projectContainer = document.createElement("div");
        projectContainer.classList.add("project-container");
        
        //Appending to right side container
        containerLeft.appendChild(projectContainer);


    
        //Project Nodes Container
        const projectNodesContainer = document.createElement("div");
        projectNodesContainer.id = 'project-nodes-container'
        register("leftSide", "projectNodesContainer", projectNodesContainer)


        const nodes = await projectServices.PROJECT_TREE("projectTree.js" ,appstate.project.path)

        console.log("Appstate form project tree is:", appstate.project.tree)
        console.log("Appstate form project tree is:", appstate.project.path)
        console.log("Skeleton form project tree is:", skeleton)

    
        newFileTree(nodes, projectNodesContainer)
    
        //Appending to library container
        projectContainer.append(projectNodesContainer);

}






async function newFileTree(nodes, container) {


    const selection = new Set();

    nodes.forEach(node => {
        let isOpen = false
        function folderSwitch() {
            isOpen = !isOpen
        }

        const treeCell = document.createElement("div")
        const folderCell = document.createElement("div")
        const name = document.createElement("p")
        const cellIcon = document.createElement("span")
        const childBlock = document.createElement("div")
        
        treeCell.classList.add("node-cell")
        folderCell.classList.add("folder-cell")
        treeCell.dataset.name = node.name
        folderCell.dataset.name = node.name

        treeCell.draggable = "true"
        treeCell.tabIndex = 0

        name.classList.add("node-name")
        cellIcon.classList.add("material-symbols-outlined", "cell-icon")
        name.dataset.path = node.path


        childBlock.classList.add("child-block")
        childBlock.dataset.childrenOf = node.name


        if (node.children) {
            folderCell.dataset.hasChildren = true
        }

        if(node.isFolder) {
            name.textContent = node.name
            cellIcon.textContent = "folder"
            treeCell.append(cellIcon, name)
            folderCell.append(treeCell)
            container.append(folderCell)
            
            if(node.children) {
                cellIcon.addEventListener('click', (event) => {
                    event.stopPropagation()
                    folderSwitch()
                    if (isOpen) {
                        folderCell.append(childBlock)
                        newFileTree(node.children, childBlock)
                    } else {
                        childBlock.replaceChildren()
                    }
                })
            }
        } else {
            name.textContent = node.name
            cellIcon.textContent = "description"
            treeCell.append(cellIcon, name)
            // treeCell.addEventListener('click', fileClick)
            function fileClick(event) {
                event.stopPropagation()
                const activeFile = name.dataset.path
                console.log("Path from projectTree.js is:", activeFile)
                appstate.file.path = activeFile
                const payload = {
                    source: "projectTree.js",
                    data: activeFile,
                }
                emit(events.file.req.editor, payload)
                console.log("EVENTLISTENER", node.name)

                emit(events.file.req.read, payload)
                
            }
            
            treeCell.removeEventListener('click', fileClick)
            treeCell.addEventListener('click', fileClick)
            container.append(treeCell)
        }

    })
}

ON(events.file.res.created,{callback: appendNewFile})

function appendNewFile() {

    const container = get("projectTree", "leftSide", "projectNodesContainer")

    // get new file path
    const newFilePath = appstate.file.newFilePath

    // extract name of the thing
    const nameExtractions = newFilePath.split(/[\\/]/);
    const newFileName = nameExtractions.pop()
    
    const node = {
        name: newFileName,
        path: newFilePath,
    }


    const treeCell = document.createElement("div")
        const folderCell = document.createElement("div")
        const name = document.createElement("p")
        const cellIcon = document.createElement("span")
        
        treeCell.classList.add("node-cell")
        folderCell.classList.add("folder-cell")
        treeCell.dataset.name = node.name
        folderCell.dataset.name = node.name


        name.classList.add("node-name")
        cellIcon.classList.add("material-symbols-outlined", "cell-icon")
        name.dataset.path = node.path


    name.textContent = node.name
            cellIcon.textContent = "description"
            treeCell.append(cellIcon, name)
            name.addEventListener('click', (event) => {
                event.stopPropagation()
                const activeFile = name.dataset.path
                console.log("Path from projectTree.js is:", activeFile)
                appstate.file.path = activeFile
                const payload = {
                    source: "projectTree.js",
                    data: activeFile,
                }
                emit(events.file.req.editor, payload)
                emit(events.file.req.read, payload)
            })
            container.append(treeCell)
}

