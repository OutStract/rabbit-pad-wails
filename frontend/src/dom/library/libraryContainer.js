import {events, emit} from '/src/events/events.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'
import {appstate} from '/src/appstate/appstate.js'

import {renderLibraryTree} from './libraryTree.js'



export async function renderLibrary() {
    const app = get("app", "app")

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

