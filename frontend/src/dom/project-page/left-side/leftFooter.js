import { appstate } from '/src/appstate/appstate.js'
import { fileServices } from '/src/api/api.js'
import {events, emit, ON} from '/src/events/events.js'
import { get } from '/src/appstate/skeleton.js'
import { cleanName, getBasePath, getName } from '/src/Labours/splitLabour'



export function projectFooter() {
    const fileContainer = get("projectTree.js","leftSide", "fileContainer")

    // Get project list
    const projectList = appstate.library.tree
    // Get current project name
    const activeProjectName = appstate.project.name

    const leftFooter = document.createElement('div')
    leftFooter.id = 'left-footer'
    fileContainer.append(leftFooter)

     // Project name element
    const nameBlock = document.createElement('div')
    const projectNameElement = document.createElement('p')
    projectNameElement.textContent = activeProjectName

    const foldIcon = document.createElement('span')
    foldIcon.classList.add("material-symbols-outlined", "fold-icon")
    foldIcon.textContent = 'unfold_more'
    
    const settingsIcon = document.createElement('span')
    settingsIcon.classList.add("material-symbols-outlined", "settings-icon")
    settingsIcon.textContent = 'settings'
    
    nameBlock.id = 'footer-name-block'
    projectNameElement.classList.add('project-name-element')

    nameBlock.append(projectNameElement, foldIcon)

    leftFooter.append(nameBlock, settingsIcon)


    // project list element
    const projectListContainer = document.createElement('div')
    // click listener on name
        // Append list above the name element
        // focus

}