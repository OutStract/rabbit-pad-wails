const app = document.getElementById("app");
import { renderLeftSide } from "./left-side/containerLeft.js";
import { renderMiddleArea } from './middle/middleContainer';
import { renderRightSide } from './rigth-side/containerRight.js';
import { renderHeader } from './header.js';

export function renderHomeContainer() {

    app.innerHTML = ""

    // Home Container
    const homeContainer = document.createElement("div");
    homeContainer.id = "home-container";

    //Appending to app
    app.appendChild(homeContainer);

    // Append Header to the home container
    renderHeader(homeContainer)

    const homeBody = document.createElement("div")
    homeBody.id = 'home-body'
    homeContainer.append(homeBody)
    
    renderLeftSide(homeBody);
    renderMiddleArea(homeBody);
    renderRightSide(homeBody)
    

    

}