import {events, emit, ON} from '/src/events/events.js'
import {logger} from '/src/logs/logger.js'
import {projectServices} from '/src/api/api.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'
import { appstate } from '/src/appstate/appstate.js'
import { fileServices } from '../../../api/api'



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


ON(events.file.res.created,{callback: wrapper})
ON(events.file.res.moved,{callback: wrapper})
ON(events.file.res.deleted,{callback: wrapper})




async function wrapper() {
    const nodes = await projectServices.PROJECT_TREE("projectTree.js" ,appstate.project.path)
    const projectNodesContainer = get("projectTree.js", "leftSide", "projectNodesContainer")
    newFileTree(nodes, projectNodesContainer) 
}




const selection = new Set();
const openFolder = new Set();
appstate.selectionList = selection

// So there was a problem where this being inside the function made multiple instances of this
// with every recursion, making cross folder movement impossible, because when you moved the file out of the folder
// It started refrencing the selection of that other folder and with other folder having empty selection it 
// Cancelld the file movement, to fix it we made selection a global variable
// Now regardless of amount of recoursions, the dragging will always reference the correct set of data 
let lastClickedCell = null;


async function newFileTree(nodes, container) {

    container.replaceChildren()

    nodes.forEach(node => {
        


        

        const rootTreeContainer = get("projectTree.js", "leftSide", "projectNodesContainer")

        function treeSelection(event) {


            // Case 1 Shift selection
        if (event.shiftKey) {
            // Get the cell that user clicked with shift
            if(!lastClickedCell) {
                lastClickedCell = treeCell
            }

            // Make an array of all the cell in the contianer with the .node-cell class
            const allCells = Array.from(rootTreeContainer.querySelectorAll(".node-cell"));

            // Find the index of the first cell user slected
            const startIdx = allCells.indexOf(lastClickedCell)

            // Make a const with the last clicked element from the user
            const endClicked = treeCell
            const endIdx = allCells.indexOf(endClicked)

            // Find which clicked cell has the smaller and bigger index number
            const minIdx = Math.min(startIdx, endIdx);
            const maxIdx = Math.max(startIdx, endIdx);

            // Clean the tree of previous cells
            rootTreeContainer.querySelectorAll('.tree-cell-selected').forEach(el => {
                el.classList.remove('tree-cell-selected')
            })
            
            // Loop through each element in the array 
            for(let i = minIdx ; i <= maxIdx ; i++) {
                const currentCell = allCells[i]
                // FInd the element in the dom
                const path = currentCell.querySelector('.node-name')?.dataset.path;

                if(path) {
                    selection.add(path)
                    currentCell.classList.add("tree-cell-selected");
                }
            }
            console.log("SHIFT SELECTION",selection)


        } 
        // CASE 2 ctrl select
        else if (event.ctrlKey) {
            if(selection.has(node.path)) {
                selection.delete(node.path)
                treeCell.classList.remove("tree-cell-selected")

            } else {
                selection.add(node.path)
                treeCell.classList.add("tree-cell-selected")
                lastClickedCell = treeCell
            }
            console.log("CTRL SELECTION",selection)
        
        } 
        // CASE 3 Single selection
        else {
            selection.clear()
            rootTreeContainer.querySelectorAll('.tree-cell-selected').forEach(el => {
                el.classList.remove('tree-cell-selected')
            })
            selection.add(node.path)
            treeCell.classList.add("tree-cell-selected")
            lastClickedCell = treeCell
            console.log("REGULAR SELECTION",selection)

        }
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
        treeCell.dataset.isFolder = node.isFolder

        folderCell.dataset.path = node.path
        treeCell.dataset.path = node.path


        

        treeCell.draggable = true
        treeCell.tabIndex = 0
        treeCell.addEventListener('click', treeSelection)
        treeCell.addEventListener('dragstart', () => {

            console.log("STARTING DRAG")
            event.dataTransfer.setData("text/plain", node.path)
            event.dataTransfer.effectAllowed = "move";
            if(!selection.has(node.path)) {
                selection.clear()
                rootTreeContainer.querySelectorAll('.tree-cell-selected').forEach(el => {
                    el.classList.remove('tree-cell-selected')
                })
                
            }  
                selection.add(node.path)
                console.log("DRAG START SELECTION CHECK",selection)
                treeCell.classList.add("tree-cell-selected")

            
        })

        treeCell.addEventListener('dragover', (event) => {
            event.preventDefault()
                            console.log ("Sources", selection)

        })

        treeCell.addEventListener('drop',  async (event) => {
            event.preventDefault(); // Prevent browser from opening the file/link
            event.stopPropagation(); // Stop it from bubbling up to parent folders
            console.log("DROP")
                const dropPath = event.currentTarget.dataset
                console.log("DESITNATION", dropPath.path)
                console.log ("Sources", selection)

                if(dropPath.isFolder === "true") {
                    
                    for(const oldPath of selection) {
                        console.log("CHECKED")
                        const sourceSplit = oldPath.split("/")
                        const sourceName = sourceSplit.pop()
                        await fileServices.MOVE_FILE("projectTree.js", dropPath.path, oldPath, sourceName)
                        console.log("DESTINATION",dropPath.path, "Original",  oldPath)
                        
                        console.log("SOURCE NAME", sourceName)

                    }
                }
        })

        
        
        name.dataset.path = node.path
        name.classList.add("node-name")
        cellIcon.classList.add("material-symbols-outlined", "cell-icon")


        childBlock.classList.add("child-block")
        childBlock.dataset.childrenOf = node.name

        let isOpen = JSON.parse(localStorage.getItem(node.path))
        function folderSwitch() {
            isOpen = !isOpen
            localStorage.setItem(node.path, isOpen)
        }
        



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
                if (isOpen) {
                        folderCell.append(childBlock)
                        newFileTree(node.children, childBlock)
                    }
                cellIcon.addEventListener('click', (event) => {
                    event.stopPropagation()
                    folderSwitch()
                    console.log("IS OPEN", isOpen)
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


