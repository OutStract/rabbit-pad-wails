import {events, emit} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'

import { renderProjectTree } from "./projectTree";
import { renderLeftToolBar } from "./leftToolBar";
import { renderLeftHeader } from "./leftHeader";
import { projectFooter } from './leftFooter';


export async function renderLeftSide() {

    console.log("PROJECT TREE SUCCESS 1")

    const homeBody = get( "containerLeft.js","app", "projectBody")

        // Left side container
        const containerLeft = document.createElement("div");
        containerLeft.classList.add("container-left");
        register("leftSide", "containerLeft", containerLeft)
        
        //Appending to home container
        homeBody.appendChild(containerLeft);
        
        const fileContainer = document.createElement("div");
        fileContainer.id = "file-container"
        register("leftSide", "fileContainer", fileContainer)
        
        containerLeft.append(fileContainer)

        //Rendering Library Tree
        renderLeftHeader()
        renderProjectTree();
        renderLeftToolBar()
        projectFooter()

    

}