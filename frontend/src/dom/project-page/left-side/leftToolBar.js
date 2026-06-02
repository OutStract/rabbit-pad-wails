import {events, emit} from '/src/events/events.js'


export function renderLeftToolBar(containerLeft) {
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
        EventsEmit("close-project");
        console.log("Event Fired")
    })
    libraryBtn.append(libraryBtnIcon) 
    
    toolBarBody.append(libraryBtn)
}