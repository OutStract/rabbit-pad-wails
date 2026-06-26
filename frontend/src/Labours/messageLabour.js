import { events, onPayload } from "../events/events"
import { get } from '../appstate/skeleton'
onPayload(events.app.req.result, {callback: userMessage})


export function userMessage(payload) {
    console.trace("MESSAGE SUCCESS", payload.success, payload.data)
    if(payload.success) return
    const app = get("messageLabour.js", "app", "app")
    const message = payload.data
    const messageBox = document.createElement("div")
    const messageText = document.createElement("p")
    messageText.textContent = message
    messageBox.id = 'system-message'
    messageText.classList.add('system-message-text')
    messageBox.append(messageText)
    app.append(messageBox)
    setTimeout(() => {
        console.log("TIMEOUT MESSAGE SUCCESS", payload.success, payload.data)
        app.removeChild(messageBox)
    }, 2000)
    console.log("MESSAGE SUCCESS", "AFTER TIMEOUT")

}