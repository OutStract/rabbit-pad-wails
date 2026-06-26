import { appstate } from '/src/appstate/appstate.js'
import { fileServices } from '/src/api/api.js'
import {events, emit, ON} from '/src/events/events.js'
import { get } from '/src/appstate/skeleton.js'
import { cleanName, getBasePath, getName, updateFilePath } from './splitLabour'
import { onPayload } from '../events/events'

const payload = {
    source: "fileLabours"
}

function updateTree() {
    emit(events.app.fileTree, payload)

}

const selection = appstate.selectionList


ON(events.file.req.delete, {callback: deleteFile})
async function deleteFile() {


    if(!selection.size) {
        console.log("DELETE DATA", !selection)
        return
    }


    const projectPath = appstate.project.path
    console.log("DELETE 2", appstate.file.path)

    for(const oldPath of selection) {
        if(selection.has(appstate.file.path)) {
            appstate.file.path = null
            console.log("DELETE 3", appstate.file.path)
        }
        const sourceName = getName(oldPath)
        localStorage.removeItem(oldPath)
        localStorage.removeItem(projectPath)
        await fileServices.DELETE_FILE("projectTree.js", projectPath, oldPath, sourceName)
        console.log("DELETE 3.5", appstate.file.path)
    }
    updateTree()
}

ON(events.file.req.rename, {callback: renameFile})
function renameFile() {

    let validName = false
    // const selection = appstate.selectionList


    // Getting The filepath for element search
    const filePath = Array.from(selection);
    const lastFilePath = filePath.at(-1)

    // Saving old name in memory
    const oldFileName = getName(lastFilePath)
    let cleanOldName = cleanName(oldFileName)

    // Getting the cell from file path
    const rootTreeContainer = get("projectTree.js", "leftSide", "projectNodesContainer")
    const renamingCell = rootTreeContainer.querySelector(`[data-path = "${CSS.escape(lastFilePath)}"]`)
    event.preventDefault(); 

    // searing for the name element to replace
    let nodeName = renamingCell.querySelector('.node-name')

    renamingCell.classList.add('this')
    renamingCell.removeChild(nodeName)
    const nameInput = document.createElement('input')
    nameInput.value = cleanOldName
    renamingCell.append(nameInput)
    nameInput.focus()

    // Getting the parent path from the tree
    let tree = [
        {
            "name": appstate.project.name,
            "path": appstate.project.path,
            "isFolder": true,
            "children": appstate.project.tree
        }
    ]
    const fileParent = getBasePath(lastFilePath)
    let parentObj = tree.filter(parent => parent.path == fileParent)[0]
    if(!parentObj) {
        tree = tree[0].children
        parentObj = tree.filter(parent => parent.path == fileParent)[0]
    }
    
    const fileObject = parentObj.children.filter(child => child.path == lastFilePath)[0]
    // Removing listener from the cell
    emit(events.file.req.cellListener, payload)
    nameInput.addEventListener('input', (event) => {

        // Getting user input for checking
        let userInput = event.target.value
        const inputStartChar = userInput[0]
        
        if(!fileObject.isFolder){
            userInput = `${event.target.value}.md`
        }


        // Validation
        const notAllowed = [".", "/", "?", "!", "#", "$", "%"]
        const nameCheck = parentObj.children.filter(child => child.name == userInput)[0]
        const charCheck = notAllowed.filter(char => char == inputStartChar)[0]


        if (charCheck) {
            nameInput.classList.add('invalid-name')
            validName = false
            return
        }
        if(nameCheck) {
            nameInput.classList.add('invalid-name')
            validName = false
            return
        }

        nameInput.classList.remove('invalid-name')
        validName = true
    });
    nameInput.addEventListener('blur', validRename)
    nameInput.addEventListener('keydown', validRename)

    function validRename(event) {
        if(event.key === 'Enter' || event.type === 'blur') {
            
            if (!validName) {
                renamingCell.classList.remove('invalid-name')
                renamingCell.removeChild(nameInput)
                renamingCell.append(nodeName)
                nodeName.textContent = oldFileName
                emit(events.file.req.cellListener, payload)
                updateTree()
                return
            }
    
            let newName = `${nameInput.value}`
            if(!fileObject.isFolder) {
                newName = `${nameInput.value}.md`
            }
            renamingCell.classList.remove('invalid-name')

                
            fileServices.RENAME_FILE("projectTree.js", lastFilePath, fileParent, newName )
                renamingCell.removeChild(nameInput)
                renamingCell.append(nodeName)
                emit(events.file.req.cellListener, payload)
                const newPath = updateFilePath(fileParent, newName)
                localStorage.setItem(appstate.project.path, newPath)
                console.log("FILE 1", appstate.file.name ,appstate.file.path)
                updateTree()
        }
    }

    
}

