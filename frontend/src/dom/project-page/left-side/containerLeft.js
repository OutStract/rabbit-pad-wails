import {events, emit} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate.js'
import { libraryServices } from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'

import { renderProjectTree } from "./projectTree";
import { renderLeftToolBar } from "./leftToolBar";
import { renderLeftHeader } from "./leftHeader";
import { EventsOn } from '../../../../wailsjs/runtime/runtime';


export async function renderLeftSide() {

    const homeBody = get("app", "projectBody")

        // Left side container
        const containerLeft = document.createElement("div");
        containerLeft.classList.add("container-left");
        register("leftSide", "containerLeft", containerLeft)
        
        //Appending to home container
        homeBody.appendChild(containerLeft);

        // EventsOn("file-created", async () => {
        //     containerLeft.replaceChildren()
        //     renderLeftToolBar(containerLeft)
        //     await renderLeftHeader(containerLeft, onCreate)
        //     await renderProjectTree(containerLeft, onLoad);

        // })
        //Rendering Library Tree
        renderLeftToolBar()
        renderLeftHeader()
        renderProjectTree();

    

}