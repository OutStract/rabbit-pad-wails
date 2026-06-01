export function renderRightSide(homeBody) {

    const containerRight = document.createElement("div");
    containerRight.classList.add("container-right");  
    containerRight.innerText = 'Right Side'
    //Appending to home container
    homeBody.append(containerRight);
}