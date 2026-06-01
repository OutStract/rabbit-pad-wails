import { renderLibraryTree } from "./libraryTree"
import { renderNewProject } from "./newProjectContainer"
import { EventsOn } from '../../../../wailsjs/runtime/runtime';
import { appState } from '../../cache.js'



export async function renderLibrary(app, libraryNodes, {makeProject, updateConfig}) {

    try {

        app.innerHTML = ""

        const libraryContainer = document.createElement("div");
        libraryContainer.id = "library-container"
        app.append(libraryContainer)


        EventsOn("new-project", async () => {
            const projectBlock = app.querySelector(".add-project-block");

            if (projectBlock) return

            await renderNewProject(libraryContainer, makeProject)
            console.log("New Project block created")
            console.log(projectBlock)
        })

        const libraryBody = document.createElement("div")
        libraryBody.id = "library-body"

        const libraryHeader = document.createElement("div")
        libraryHeader.id = "library-header"
        libraryHeader.textContent = appState.libraryName
        

        renderLibraryTree(libraryBody, libraryNodes, updateConfig)

        libraryContainer.append(libraryHeader,libraryBody)

    }
    catch(err) {
        console.log(err)
    }
}

