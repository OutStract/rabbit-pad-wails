import {events, emit, ON} from '/src/events/events.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'
import {appstate} from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'

import { codeMirror } from './codeMirror.js'

export function renderMiddleArea() {

    const homeBody = get("middleContainer.js","app", "projectBody")

    const middleArea = document.createElement("div")
    middleArea.id = "middle-area"
    homeBody.append(middleArea)


    const middleBody = document.createElement("div")
    register("middle", "middleBody", middleBody)
    middleBody.id = 'middle-body'
    
    middleArea.append(middleBody)

    if(!appstate.file.path) {
        middleBody.textContent = "No File is opened"
        return
    }
    
}

ON(events.file.req.editor, {callback: renderEditor})

function renderEditor() {
    const middleBody = get("middleContainer.js function", "middle" ,"middleBody")
    middleBody.replaceChildren()
    console.log("RENDERING CODE MIRROR WITH PATH", appstate.file.path)
    codeMirror()
}