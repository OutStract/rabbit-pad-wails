import {events, emit, ON} from '/src/events/events.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'
import {appstate} from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'

import { codeMirror } from './codeMirror.js'

ON(events.file.req.delete, {callback: cleanMiddleBody})

function cleanMiddleBody () {
    const middleBodyMessage = document.createElement('div')
    middleBodyMessage.textContent = "No File is opened"

    const middleBody = get("middleContainer.js function", "middle" ,"middleBody")
    console.log("DELETE 4", appstate.file.path)
    if(appstate.file.path === null && localStorage.getItem(appstate.project.path) === null) {
        middleBody.replaceChildren()
        console.log("DELETE 5", appstate.file.path)
        console.log(localStorage.getItem(appstate.project.path))
        middleBody.append(middleBodyMessage)
        return
    }
}



export function renderMiddleArea() {

    const homeBody = get("middleContainer.js","app", "projectBody")

    const middleArea = document.createElement("div")
    middleArea.id = "middle-area"
    homeBody.append(middleArea)


    const middleBody = document.createElement("div")
    register("middle", "middleBody", middleBody)
    middleBody.id = 'middle-body'

    const middleBodyMessage = document.createElement('div')
    middleBodyMessage.textContent = "No File is opened"
    
    middleArea.append(middleBody)

    if(!appstate.file.path && localStorage.getItem(appstate.project.path) === null) {
        console.log(localStorage.getItem(appstate.project.path))
        middleBody.append(middleBodyMessage)
        return
    }
    
    if(localStorage.getItem(appstate.project.path)) {
        appstate.file.path = localStorage.getItem(appstate.project.path)
        console.log("STEP 1",appstate.file.path)
        const payload = {
            source: "middleContainer.js",
            data: appstate.file.path,
        }
        emit(events.file.req.editor, payload)
        emit(events.file.req.read, payload)
    }
    
}

ON(events.file.req.editor, {callback: renderEditor})


function renderEditor() {
    console.log("STEP 2",appstate.file.path)
    const middleBody = get("middleContainer.js function", "middle" ,"middleBody")
    middleBody.replaceChildren()
    codeMirror()
}