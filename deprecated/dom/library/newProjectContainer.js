import {events, emit, ON} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { projectServices } from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'

ON(events.project.req.create, {callback: renderNewProject})


export async function renderNewProject() {
    
        const addProjectContainer = document.createElement("div")
        addProjectContainer.classList.add ("add-project-block")

        const app = get("newProjectContainer.js","app", "app")

        app.append(addProjectContainer)

        const addProjectHeader = document.createElement("div")
        addProjectHeader.id = "add-project-header"

        const addProjectBody = document.createElement("div")
        addProjectBody.id = "lib-new-proj-body"

        const addProjectName = document.createElement("input")
        addProjectName.placeholder = "New Project Name"
        addProjectName.id = "new-proj-input"
        addProjectName.focus
        const warningContainer = document.createElement('div')
        warningContainer.classList.add('project-input-warning-container')
        const inputWarning = document.createElement('p')
        inputWarning.classList.add('project-input-warning')

        addProjectName.addEventListener('input', (event) => {
            const projectTree = appstate.library.tree
            const userInput = event.target.value
            
            const inputStartChar = userInput[0]
            const notAllowed = [".", "/", "?", "!", "#", "$", "%"]
            
            const nameCheck = projectTree.filter(project => project.name.toLowerCase() === userInput.toLowerCase())[0]
            const charCheck = notAllowed.filter(char => char === userInput[0])[0]

            if(nameCheck || charCheck) {
                warningContainer.append(inputWarning)
                addProjectName.classList.add('not-allowed')
                createProjBtn.disabled = true
            }

            if(nameCheck) {
                inputWarning.textContent = "Project with same name already exist"
            } else if (charCheck) {
                inputWarning.textContent = "Project name cannot contain special characters like: . / ? ! # $"
            } else {
                warningContainer.removeChild(inputWarning)
                addProjectName.classList.remove('not-allowed')
                createProjBtn.disabled = false
            }

        })

        const createProjBtn = document.createElement("button")
        createProjBtn.textContent = "Create"
        createProjBtn.id = "create-proj-btn"
        createProjBtn.addEventListener('click',async () => {
            const name = addProjectName.value
            const path = appstate.library.path
            await projectServices.MAKE_PROJECT("newProjectContainer.js",path, name)
            addProjectContainer.remove()
        })


        addProjectBody.append(warningContainer, addProjectName, createProjBtn)

        const removeProjectContainer = document.createElement("span")
        removeProjectContainer.classList.add("material-symbols-outlined")
        removeProjectContainer.textContent = "close"
        removeProjectContainer.addEventListener("click", () => {
            addProjectContainer.remove()
        })

        addProjectHeader.append(removeProjectContainer)

        const libraryContainer = get("newProjectContainer.js","library", "libraryContainer")
        libraryContainer.append(addProjectContainer)

        addProjectContainer.append(addProjectHeader, addProjectBody)
}