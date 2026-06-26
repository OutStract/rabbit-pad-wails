
import {events, emit, ON} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'


import { renderLeftSide } from './left-side/containerLeft.js'
import { renderMiddleArea } from './middle/middleContainer.js'
import { renderRightSide } from './right-side/containerRight.js'
import { renderHeader } from './header.js'

ON(events.project.req.open, {callback: renderProjectContainer})


export function renderProjectContainer() {

        console.log("PROJECT CONTAINER SUCCESS")

        const app = get("projectContainer.js","app", "app")
        console.log(app)
        app.replaceChildren()
    
        // Home Container
        const projectContainer = document.createElement("div");
        projectContainer.id = "main-project-container";
        register("app", "projectContainer", projectContainer)
    
        //Appending to app
        app.appendChild(projectContainer);
    
        // Append Header to the home container
        renderHeader()
    
        const projectBody = document.createElement("div")
        projectBody.id = 'project-body'
        register("app", "projectBody", projectBody)
        projectContainer.append(projectBody)
        
        renderLeftSide();
        renderMiddleArea();
        renderRightSide()

}