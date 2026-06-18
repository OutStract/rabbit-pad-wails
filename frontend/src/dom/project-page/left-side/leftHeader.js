import {events, emit} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { fileServices } from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'


export async function renderLeftHeader () {

    const selection = appstate.selectionList
    const projectPath = appstate.project.path

    const containerLeft = get("leftHeader", "leftSide", "fileContainer")

        const leftHeaderBody = document.createElement("div")
        const leftHeaderBtn = document.createElement("div")
        leftHeaderBtn.classList.add("left-header-btn")


        const projectTitleBlock = document.createElement("div")
        const projectTitle = document.createElement("h2")
        projectTitle.textContent = appstate.project.name
        projectTitle.classList.add("project-title")

        projectTitleBlock.append(projectTitle)


        const newFileBtn = document.createElement("div")
            const newFileBtnIcon = document.createElement("span")
            newFileBtnIcon.classList.add("material-symbols-outlined")
            newFileBtnIcon.textContent = "add_notes"
            newFileBtnIcon.addEventListener('click', async () => {
                await fileServices.CREATE_FILE("leftHeader.js",appstate.project.path)
            })
            newFileBtn.append(newFileBtnIcon)
        
        const deleteFileBtn = document.createElement("div")
            const deleteFileBtnIcon = document.createElement("span")
            deleteFileBtnIcon.classList.add("material-symbols-outlined")
            deleteFileBtnIcon.textContent = "delete"
            deleteFileBtnIcon.addEventListener('click', async () => {
                for(const oldPath of selection) {
                        const sourceSplit = oldPath.split("/")
                        const sourceName = sourceSplit.pop()
                        await fileServices.DELETE_FILE("projectTree.js", projectPath, oldPath, sourceName)
                        console.log("Original" ,oldPath)
                        
                        console.log("SOURCE NAME", sourceName)

                    }
            })
            deleteFileBtn.append(deleteFileBtnIcon)

            leftHeaderBtn.append(newFileBtn, deleteFileBtn)
    
            containerLeft.append(leftHeaderBody)
    
            leftHeaderBody.append(projectTitleBlock, leftHeaderBtn)

}