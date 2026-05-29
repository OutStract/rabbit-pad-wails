import { renderProjectTree } from "./projectTree";
import { renderLeftToolBar } from "./leftToolBar";

export function renderLeftSide(homeBody) {
    // Left side container
    const containerLeft = document.createElement("div");
    containerLeft.classList.add("container-left");
    
    //Appending to home container
    homeBody.appendChild(containerLeft);
    
    //Rendering Library Tree
    renderLeftToolBar(containerLeft)
    renderProjectTree(containerLeft);


}