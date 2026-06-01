import { appState } from '../../cache.js'


export async function renderNewProject(libraryContainer, makeProject) {

    try {

        const addProjectContainer = document.createElement("div")
        addProjectContainer.classList.add ("add-project-block")

        const addProjectHeader = document.createElement("div")
        addProjectHeader.id = "add-project-header"

        const addProjectBody = document.createElement("div")
        addProjectBody.id = "lib-new-proj-body"

        const addProjectName = document.createElement("input")
        addProjectName.placeholder = "New Project Name"
        addProjectName.id = "new-proj-input"
        addProjectName.focus

        const createProjBtn = document.createElement("button")
        createProjBtn.textContent = "Create"
        createProjBtn.id = "create-proj-btn"
        createProjBtn.addEventListener('click',async () => {
            const name = addProjectName.value
            const path = appState.libraryPath
            console.log(path, name)
            await makeProject(path, name)
            addProjectContainer.remove()
        })


        addProjectBody.append(addProjectName, createProjBtn)

        const removeProjectContainer = document.createElement("span")
        removeProjectContainer.classList.add("material-symbols-outlined")
        removeProjectContainer.textContent = "close"
        removeProjectContainer.addEventListener("click", () => {
            addProjectContainer.remove()
        })

        addProjectHeader.append(removeProjectContainer)

        libraryContainer.append(addProjectContainer)

        addProjectContainer.append(addProjectHeader, addProjectBody)

    } catch(err) {
        console.log(err)
    }
}