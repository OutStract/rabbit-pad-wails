
import { codeMirror } from './codeMirror.js'

export function renderMiddleArea(homeBody) {

    const middleArea = document.createElement("div")
    middleArea.id = "middle-area"
    homeBody.append(middleArea)


    const middleBody = document.createElement("div")
    middleBody.id = 'middle-body'
    
    middleArea.append(middleBody)
    codeMirror(middleBody)
}