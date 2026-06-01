import { EventsEmit } from '../../../../../wailsjs/runtime/runtime';
import { EventsOn } from '../../../../../wailsjs/runtime/runtime';

export function renderLeftToolBar(containerLeft) {
    const toolBarBody = document.createElement("div")
    toolBarBody.classList.add("left-tool-bar")
    containerLeft.append(toolBarBody)

    const foldersBtn = document.createElement("div")
    const folderBtnIcon = document.createElement("span")
    folderBtnIcon.classList.add("material-symbols-outlined")
    folderBtnIcon.textContent = "folder"
    foldersBtn.append(folderBtnIcon)

    const libraryBtn = document.createElement("div")
    const libraryBtnIcon = document.createElement("span")
    libraryBtnIcon.classList.add("material-symbols-outlined")
    libraryBtnIcon.textContent = "library_books"
    libraryBtnIcon.addEventListener('click', () => {
        EventsEmit("close-project")
    })
    libraryBtn.append(libraryBtnIcon) 
    
    toolBarBody.append(foldersBtn, libraryBtn)
}