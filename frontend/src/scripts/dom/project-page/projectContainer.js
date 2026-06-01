
import { renderLeftSide } from "./left-side/containerLeft.js";
import { renderMiddleArea } from './middle/middleContainer.js';
import { renderRightSide } from './rigth-side/containerRight.js';
import { renderHeader } from './header.js';

export async function renderProjectContainer(app, {onLoad}) {

    try {

        app.innerHTML = ""
    
        // Home Container
        const projectContainer = document.createElement("div");
        projectContainer.id = "project-container";
    
        //Appending to app
        app.appendChild(projectContainer);
    
        // Append Header to the home container
        renderHeader(projectContainer)
    
        const projectBody = document.createElement("div")
        projectBody.id = 'project-body'
        projectContainer.append(projectBody)
        
        await renderLeftSide(projectBody, onLoad);
        renderMiddleArea(projectBody);
        renderRightSide(projectBody)

    } catch(err) {
        console.log(err)
    }


}