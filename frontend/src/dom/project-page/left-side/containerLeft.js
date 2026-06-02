import { renderProjectTree } from "./projectTree";
import { renderLeftToolBar } from "./leftToolBar";
import { renderLeftHeader } from "./leftHeader";
import { EventsOn } from '../../../../wailsjs/runtime/runtime';


export async function renderLeftSide(homeBody, onLoad, onCreate) {

    try {
        // Left side container
        const containerLeft = document.createElement("div");
        containerLeft.classList.add("container-left");
        
        //Appending to home container
        homeBody.appendChild(containerLeft);

        // EventsOn("file-created", async () => {
        //     containerLeft.replaceChildren()
        //     renderLeftToolBar(containerLeft)
        //     await renderLeftHeader(containerLeft, onCreate)
        //     await renderProjectTree(containerLeft, onLoad);

        // })
        //Rendering Library Tree
        renderLeftToolBar(containerLeft)
        await renderLeftHeader(containerLeft, onCreate)
        await renderProjectTree(containerLeft, onLoad);

    } catch(err) {
        console.log(err)
    }

}