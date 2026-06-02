import {logger} from '/src/logs/logger.js'


export async function renderLeftHeader (containerLeft, onCreate) {
    try {
        const leftHeaderBody = document.createElement("div")
        const newFileBtn = document.createElement("div")
            const newFileBtnIcon = document.createElement("span")
            newFileBtnIcon.classList.add("material-symbols-outlined")
            newFileBtnIcon.textContent = "add_notes"
            newFileBtnIcon.addEventListener('click', async () => {
                await onCreate(appState.activeProjectPath)
            })
            newFileBtn.append(newFileBtnIcon)
    
            containerLeft.append(leftHeaderBody)
    
            leftHeaderBody.append(newFileBtn)
    }
    catch(err) {
        logger.ERROR("ASYNC", "leftHeader.js", "Something went wrong in the file operation", err)
    }

}