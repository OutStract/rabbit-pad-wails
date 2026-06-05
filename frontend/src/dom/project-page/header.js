import {events, emit, ON} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'



export function renderHeader() {

    const projectContainer = get("header.js","app", "projectContainer")

    //Header Container
    const header = document.createElement("header");
    header.classList.add("header");

    //appending to app
    projectContainer.append(header);

    //Left Buttons container
    const leftBtns = document.createElement("div");
    const leftDockBtn = document.createElement("span");
    leftDockBtn.classList.add("material-symbols-outlined");
    leftDockBtn.textContent = "dock_to_right";
    leftBtns.appendChild(leftDockBtn);


    //Right Buttons container
    const rightBtns = document.createElement("div");
    const rightDockBtn = document.createElement("span");
    rightDockBtn.classList.add("material-symbols-outlined");
    rightDockBtn.textContent = "dock_to_left";
    rightBtns.appendChild(rightDockBtn);

    //appending to header
    header.append(leftBtns,rightBtns);
    
}