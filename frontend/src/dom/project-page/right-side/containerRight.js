import {events, emit, ON} from '/src/events/events.js'
import {register, get, skeleton} from '/src/appstate/skeleton.js'
import {appstate} from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'

export function renderRightSide() {

    const homeBody = get("app", "projectBody")

    const containerRight = document.createElement("div");
    containerRight.classList.add("container-right");  
    containerRight.innerText = 'Right Side'
    //Appending to home container
    homeBody.append(containerRight);
}