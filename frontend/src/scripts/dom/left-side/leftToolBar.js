export function renderLeftToolBar(containerLeft) {
    const toolBarBody = document.createElement("div")
    toolBarBody.classList.add("left-tool-bar")
    containerLeft.append(toolBarBody)

    const foldersBtn = document.createElement("div")
    const folderBtnIcon = document.createElement("span")
    folderBtnIcon.classList.add("material-symbols-outlined")
    folderBtnIcon.textContent = "folder"
    foldersBtn.append(folderBtnIcon)
    
    toolBarBody.append(foldersBtn)
}