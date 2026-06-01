import { renderProjectTree } from "./projectTree";
import { renderLeftToolBar } from "./leftToolBar";

export async function renderLeftSide(homeBody, onLoad) {

    try {
        // Left side container
        const containerLeft = document.createElement("div");
        containerLeft.classList.add("container-left");
        
        //Appending to home container
        homeBody.appendChild(containerLeft);
        
        //Rendering Library Tree
        renderLeftToolBar(containerLeft)
        await renderProjectTree(containerLeft, onLoad);

    } catch(err) {
        console.log(err)
    }

}