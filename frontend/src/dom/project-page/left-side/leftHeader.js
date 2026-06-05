import {events, emit} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { fileServices } from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'


export async function renderLeftHeader () {

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

            leftHeaderBtn.append(newFileBtn)
    
            containerLeft.append(leftHeaderBody)
    
            leftHeaderBody.append(projectTitleBlock, leftHeaderBtn)

}