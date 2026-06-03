import {events, emit, ON} from '/src/events/events.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'
import {appstate} from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'

import { codeMirror } from './codeMirror.js'

export function renderMiddleArea() {

    const homeBody = get("app", "projectBody")

    const middleArea = document.createElement("div")
    middleArea.id = "middle-area"
    homeBody.append(middleArea)


    const middleBody = document.createElement("div")
    middleBody.id = 'middle-body'
    
    middleArea.append(middleBody)
    codeMirror(middleBody)
}