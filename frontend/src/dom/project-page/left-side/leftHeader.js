import {events, emit} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { fileServices } from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'


export async function renderLeftHeader () {

    const containerLeft = get("leftSide", "containerLeft")

        const leftHeaderBody = document.createElement("div")
        const newFileBtn = document.createElement("div")
            const newFileBtnIcon = document.createElement("span")
            newFileBtnIcon.classList.add("material-symbols-outlined")
            newFileBtnIcon.textContent = "add_notes"
            newFileBtnIcon.addEventListener('click', async () => {
                await fileServices.CREATE_FILE("leftHeader.js",appstate.project.path)
            })
            newFileBtn.append(newFileBtnIcon)
    
            containerLeft.append(leftHeaderBody)
    
            leftHeaderBody.append(newFileBtn)

}