import { appstate } from '/src/appstate/appstate.js'
import { register, get } from '/src/appstate/skeleton.js'
import { libraryServices } from '/src/api/api.js'
import {events, emit, ON} from '/src/events/events.js'
import { cleanName, getBasePath, getName } from '/src/Labours/splitLabour'



let isExpanded = false

export function projectFooter() {
    const activeProjectName = appstate.project.name
    const fileContainer = get("projectTree.js","leftSide", "fileContainer")

    isExpanded = false

    const leftFooter = document.createElement('div')
    leftFooter.id = 'left-footer'
    fileContainer.append(leftFooter)
    
    const projectListExpand = document.createElement('div')
    projectListExpand.classList.add('expanded-project-list')
    register("leftSide", "projectListExpand", projectListExpand)

     // Project name element
    const nameBlock = document.createElement('div')
    const projectNameElement = document.createElement('p')
    projectNameElement.textContent = activeProjectName
    nameBlock.id = 'footer-name-block'

    nameBlock.addEventListener('click', switchBtn)

    function switchBtn() {
        switchProject()
        nameBlock.removeEventListener('click', switchBtn)
        nameBlock.addEventListener('click', switchBtn)
    }

    const foldIcon = document.createElement('span')
    foldIcon.classList.add("material-symbols-outlined", "fold-icon")
    foldIcon.textContent = 'unfold_more'
    
    const settingsIcon = document.createElement('span')
    settingsIcon.classList.add("material-symbols-outlined", "settings-icon")
    settingsIcon.textContent = 'settings'

    const footerContainer = document.createElement('div')
    footerContainer.classList.add('footer-content')
    
  
    projectNameElement.classList.add('project-name-element')

    nameBlock.append(projectNameElement, foldIcon)

    projectListExpand.append(nameBlock)

    footerContainer.append(projectListExpand, settingsIcon)

    leftFooter.append(footerContainer)

}

function switchProject() {

    if (isExpanded) {
        console.log("IS EXPANDED", isExpanded)
        const activeContainer = document.getElementsByClassName("expanded-list-container");
        console.log(activeContainer)
        if(activeContainer[0]) {
            console.log("IS EXPANDED", isExpanded)
            activeContainer[0].remove()
        }
        isExpanded = false
        return
    }
    const projectList = appstate.library.tree
    const activeProjectName = appstate.project.name

    const filteredProjectList = projectList.filter(list => list.name !== activeProjectName)

    const libPath = appstate.library.path
    const expandList = get("leftFooter.js", "leftSide", "projectListExpand")
    
    const projectListContainer = document.createElement('div');
    projectListContainer.classList.add("expanded-list-container")
    isExpanded = true
    console.log("SWITCH 2")
    
    filteredProjectList.forEach(project => {
        const nameBlock = document.createElement('div')
        const nameText = document.createElement('p')
        nameBlock.id = 'footer-name-block'
        nameText.classList.add('project-name-element')

        nameBlock.dataset.path = project.path
        nameBlock.dataset.name = project.name

        nameText.textContent = project.name

        nameBlock.append(nameText)

        nameBlock.addEventListener('click', async () => {
            const payload = {
                source: "leftFooter.js",
                data: project.path
            }
            await libraryServices.UPDATE_LIB_CONFIG("libraryTree.js",libPath, project.path)

            emit(events.project.req.open, payload)
        })
        console.log("SWITCH 3")
        projectListContainer.append(nameBlock)
    });
    console.log("SWITCH 4")
    expandList.prepend(projectListContainer)

}