import {events, emit} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'

export function renderLeftToolBar() {


    const containerLeft = get("leftSide", "containerLeft")

    const toolBarBody = document.createElement("div")
    toolBarBody.classList.add("left-tool-bar")
    containerLeft.append(toolBarBody)

    // const foldersBtn = document.createElement("div")
    // const folderBtnIcon = document.createElement("span")
    // folderBtnIcon.classList.add("material-symbols-outlined")
    // folderBtnIcon.textContent = "folder"
    // foldersBtn.append(folderBtnIcon)

    const libraryBtn = document.createElement("div")
    const libraryBtnIcon = document.createElement("span")
    libraryBtnIcon.classList.add("material-symbols-outlined")
    libraryBtnIcon.textContent = "library_books"
    libraryBtnIcon.addEventListener('click', () => {
        emit(events.project.req.close);
    })
    libraryBtn.append(libraryBtnIcon) 
    
    toolBarBody.append(libraryBtn)
}