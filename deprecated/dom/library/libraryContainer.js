import {events, emit, ON} from '/src/events/events.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'
import {appstate} from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'

import {renderLibraryTree} from './libraryTree.js'

ON(events.project.req.close, {callback: renderLibrary})

export async function renderLibrary() {
    
    const libPath = appstate.library.path
    await libraryServices.UPDATE_LIB_CONFIG("libraryContainer.js", libPath, "")

    const app = get( "libraryContainer.js" ,"app", "app")

    app.replaceChildren()

    const libraryContainer = document.createElement("div");
    libraryContainer.id = "library-container"
    register("library", "libraryContainer", libraryContainer)

    
    app.append(libraryContainer)

    const libraryBody = document.createElement("div")
    libraryBody.id = "library-body"
    register("library", "libraryBody", libraryBody)



    const libraryHeader = document.createElement("div")
    libraryHeader.id = "library-header"
    register("library", "libraryHeader", libraryHeader)

    libraryHeader.textContent = appstate.library.name
    libraryContainer.append(libraryHeader,libraryBody)

    renderLibraryTree()
}

