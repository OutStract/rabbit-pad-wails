import {events, emit, ON} from '/src/events/events.js'
import {logger} from '/src/logs/logger.js'
import {projectServices} from '/src/api/api.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'
import { appstate } from '/src/appstate/appstate.js'
import { fileServices } from '../../../api/api'
import { getName, updateFilePath } from '../../../Labours/splitLabour'
import { onPayload } from '../../../events/events'

console.log("TREE FILE SUCCESS")
let isListener = true
ON(events.file.req.cellListener, {callback: disableCellListeners})
function disableCellListeners() {
    isListener = !isListener
}

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
        projectNodesContainer.dataset.path = appstate.project.path
        projectNodesContainer.dataset.isFolder = true
        projectNodesContainer.addEventListener('dragover', (event) => {
            event.preventDefault()
        })

        projectNodesContainer.addEventListener('drop', dropHandler)
        

        // async function rootDrop(event) {
        //     event.preventDefault(); // Prevent browser from opening the file/link
        //     event.stopPropagation(); // Stop it from bubbling up to parent folders
        //         const dropPath = event.currentTarget.dataset
        //         if(dropPath.isFolder) {
        //             for(const oldPath of selection) {
        //                 const sourceName = getName(oldPath)
        //                 const localPath = localStorage.getItem(appstate.project.path)

        //                 if(localPath) {
        //                     const localName = getName(localPath)
        //                     if(sourceName === localName) {
        //                         const newPath = updateFilePath(dropPath.path, sourceName)
        //                         localStorage.setItem(appstate.project.path, newPath)
        //                     }
        //                 }
        //                 const result = await fileServices.MOVE_FILE("projectTree.js", dropPath.path, oldPath, sourceName)
        //                 selection.delete(oldPath)
        //                 console.log("SUCCESS MESSAGE",result.success, result)
        //                     emit(events.app.req.result, result)
        //             }
        //         }
        //     isListener = true
        //     projectNodesContainer.removeEventListener('drop', rootDrop)
        //     projectNodesContainer.addEventListener('drop', rootDrop)
        // }

        register("leftSide", "projectNodesContainer", projectNodesContainer)

        const nodes = await projectServices.PROJECT_TREE("projectTree.js" ,appstate.project.path)

        const payload = {
            success: true
        }

        console.log("PARENT WRAPPER CALL SUCCESS")

        wrapper(payload)
    
        //Appending to library container
        projectContainer.append(projectNodesContainer);

}


onPayload(events.file.res.created,{callback: wrapper})
onPayload(events.folder.res.created,{callback: wrapper})
// onPayload(events.file.res.moved,{callback: wrapper})
onPayload(events.app.req.fileTree,{callback: wrapper})




async function wrapper(payload) {
    console.log("WRAPPER SUCCESS", payload)
    if(!payload.success) return
    const nodes = await projectServices.PROJECT_TREE("projectTree.js" ,appstate.project.path)
    const projectNodesContainer = get("projectTree.js", "leftSide", "projectNodesContainer")
    projectNodesContainer.replaceChildren()
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

    console.log("NODES", nodes)
    console.log("PROJECT PATH",appstate.project.path)

    

    nodes.forEach(node => {

        const rootTreeContainer = get("projectTree.js", "leftSide", "projectNodesContainer")

        function treeSelection(event) {
            event.stopPropagation()

            if(!isListener) {
                return
            }
            
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
        }
        treeCell.removeEventListener('click', treeSelection)
        treeCell.addEventListener('click', treeSelection)
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

        // folderCell.dataset.path = node.path
        treeCell.dataset.path = node.path

        treeCell.draggable = true
        treeCell.tabIndex = 0
        treeCell.addEventListener('click', treeSelection)
        treeCell.addEventListener('dragstart', dragStart)

        function dragStart(event) {
            event.stopPropagation()
            event.dataTransfer.setData("text/plain", node.path)
            event.dataTransfer.effectAllowed = "move";
            if(!selection.has(node.path)) {
                selection.clear()
                rootTreeContainer.querySelectorAll('.tree-cell-selected').forEach(el => {
                    el.classList.remove('tree-cell-selected')
                })
                
            }  
                selection.add(node.path)
                treeCell.classList.add("tree-cell-selected")

                treeCell.removeEventListener('dragstart', dragStart)
                treeCell.addEventListener('dragstart', dragStart)
                
        }

        treeCell.addEventListener('dragover', (event) => {
            event.preventDefault()
        })

        treeCell.addEventListener('drop',  dropHandler)
        
        
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
                        cellIcon.textContent = "folder_open"
                        newFileTree(node.children, childBlock)
                    }
                cellIcon.addEventListener('click', (event) => {
                    event.stopPropagation()
                    folderSwitch()
                    if (isOpen) {
                        folderCell.append(childBlock)
                        cellIcon.textContent = "folder_open"
                        newFileTree(node.children, childBlock)
                    } else {
                        cellIcon.textContent = "folder"
                        childBlock.replaceChildren()
                    }
                })
            }
        } else {
            name.textContent = node.name
            cellIcon.textContent = "description"
            treeCell.append(cellIcon, name)
            function fileClick(event) {
                if(!isListener) {
                    return
                }
                event.stopPropagation()

                const activeFile = name.dataset.path
                appstate.file.path = activeFile
                appstate.file.name = node.name
                localStorage.setItem(appstate.project.path, activeFile)
                const payload = {
                    source: "projectTree.js",
                    data: activeFile,
                }
                emit(events.file.req.editor, payload)

                emit(events.file.req.read, payload)
                
            }
            
            treeCell.removeEventListener('click', fileClick)
            treeCell.addEventListener('click', fileClick)
            container.append(treeCell)
        }

    })

    if(localStorage.getItem(appstate.project.path) != null) {
        const lastOpenedFile = localStorage.getItem(appstate.project.path)
        appstate.file.path = lastOpenedFile
        appstate.file.name = getName(lastOpenedFile)
        
        console.log("FILE 2", appstate.file.name ,appstate.file.path)
        const rootTreeContainer = get("projectTree.js", "leftSide", "projectNodesContainer")

        console.log("FILE 3", appstate.file.name ,appstate.file.path)

        selection.add(lastOpenedFile)
        const selectionCell = rootTreeContainer.querySelector(`[data-path = "${CSS.escape(lastOpenedFile)}"]`)
        if(!selectionCell) return
        selectionCell.classList.add("tree-cell-selected")
        console.log("FILE 4", appstate.file.name ,appstate.file.path)
    }
}


async function dropHandler(event) {

    event.preventDefault(); // Prevent browser from opening the file/link
    event.stopPropagation(); // Stop it from bubbling up to parent folders
        const dropPath = event.currentTarget.dataset
        let results = null

        if(dropPath.isFolder === "true") {

            console.log("BEFORE DROP SELECTION", [...selection])
            
            for(const oldPath of selection) {
                const sourceName = getName(oldPath)
                console.log("NEW SELECTION FILE TREE", selection)

                const localPath = localStorage.getItem(appstate.project.path)
                console.log("MOVE 1", localPath)

                if(localPath) {
                    const localName = getName(localPath)
                    if(sourceName === localName) {
                        const newPath = updateFilePath(dropPath.path, sourceName)
                        localStorage.setItem(appstate.project.path, newPath)
                    }
                } 

                const result = await fileServices.MOVE_FILE("projectTree.js", dropPath.path, oldPath, sourceName)
                selection.delete(oldPath)
                emit(events.app.req.result, result)
                results = result
                console.log("NEW FILE TREE", result.data)
            }
        }
    isListener = true
    this.removeEventListener('drop', dropHandler)
    this.addEventListener('drop',  dropHandler)
    emit(events.app.req.fileTree, results)
    console.log("AFTER DROP SELECTION", [...selection])
}