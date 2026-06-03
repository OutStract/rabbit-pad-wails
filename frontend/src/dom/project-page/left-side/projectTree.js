import {events, emit, ON} from '/src/events/events.js'
import {logger} from '/src/logs/logger.js'
import {projectServices} from '/src/api/api.js'
import {register, get} from '/src/appstate/skeleton.js'
import { appstate } from '/src/appstate/appstate.js'



export async function renderProjectTree() {

    const containerLeft = get("leftSide", "containerLeft")

        const projectName = appstate.project.name

        // const projectTree = await onLoad(appState.activeProjectPath)
        //Project Tree Container
        const projectContainer = document.createElement("div");
        projectContainer.classList.add("project-container");
        
        //Appending to right side container
        containerLeft.appendChild(projectContainer);
    
        //Project Title
        const projectTitle = document.createElement("h2");
        projectTitle.textContent = projectName;
        projectTitle.classList.add("project-title")

    
        //Project Nodes Container
        const projectNodesContainer = document.createElement("div");
        register("leftSide", "projectNodesContainer", projectNodesContainer)
        projectNodesContainer.id = 'project-nodes-container'

        ON(events.file.res.created, {callback: libraryNodes})

        const nodes = await projectServices.PROJECT_TREE("projectTree.js" ,appstate.project.path)
        const container = get("leftSide", "projectNodesContainer")
    
        newFileTree(nodes, container)
    
        //Appending to library container
        projectContainer.append(projectTitle, projectNodesContainer);

}


async function libraryNodes(nodes, container) {
    //So comment time because i am sure i will forget what i did
    container.replaceChildren()

    logger.INFO("DOM", "projectTree.js", "Rendering project tree", null)
    nodes.forEach ( node => { // Simple taking the json file of all the folders and moveing them one by one in a loop

        let folderIsOpen = false
        
        function openFolder() {
            folderIsOpen = !folderIsOpen
        }
        const name = document.createElement("p")
        name.textContent = node.name
        name.classList.add ("tree-node")
        name.dataset.filepath = node.path
        container.append(name)  // This one was a pain to figure out, thing is
        // When you append the parents at the end of the code then the children will be above the parents
        //Because when you later scan for childrens with an if() and start recursion, the recursion will be finished first and then the code move forward to append the parent
        //By appending the parents first at the start of the code we make sure that later when folders are being checked for childrens 
        // They append after the parent

        const childrenBlock = document.createElement("div") // This will be used as a storage space for all teh childrens
        childrenBlock.classList.add ("children-block")

        function removeFolderEvent (event) {
            event.stopPropagation()
            openFolder() // Making open folder true
            const children = node.children

            if (folderIsOpen) { 
                if(node.children) {
                    libraryNodes(children, childrenBlock)  // Starting the recursion, but this time passing the children storage we made before
                }
            } else {
                childrenBlock.replaceChildren() // So if the folder closes this function will clear the storage space of children
            }
            console.log("func",folderIsOpen)
        }

        name.addEventListener("click", removeFolderEvent)

            if (node.children) {
            container.append(childrenBlock)  // This is a check to make sure only folders WITH children get the storage space, keeping the dom clean
        }

    })  
}

async function newFileTree(nodes, container) {

    nodes.forEach(node => {
        const body = document.createElement("div")
        const cell = document.createElement("div")
        const name = document.createElement("p")
        const icon = document.createElement("div")
        const childBlock = document.createElement("div")

        cell.classList.add("node-cell")
        name.classList.add("node-name")
        childBlock.classList.add("child-block")
        childBlock.dataset.parent = node.name

        body.dataset.name = node.name
        if (node.children) {
            body.dataset.hasChildren = true
        }

        if(node.isFolder) {
            name.textContent = node.name
            icon.textContent = "D"
            cell.append(icon, name)
            body.append(cell)

            if(node.children) {
                body.append(childBlock)
                newFileTree(node.children, childBlock)
            }
        } else {
            name.textContent = node.name
            icon.textContent = "F"
            cell.append(icon, name)
            body.append(cell)
        }

        container.append(body)
    })
}