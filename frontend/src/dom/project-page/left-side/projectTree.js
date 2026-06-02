import {events, emit} from '/src/events/events.js'
import {logger} from '/src/logs/logger.js'
import {projectServices} from '/src/api/api.js'



export async function renderProjectTree(containerLeft, onLoad) {

    try {


        const projectName = appState.projectName

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
        projectNodesContainer.id = 'project-nodes-container'

        EventsOn("file-created", async () => {
            projectNodesContainer.innerHTML = ""
            
            await libraryNodes(projectNodesContainer, onLoad)
        })
    
        await libraryNodes(projectNodesContainer, onLoad)
    
        //Appending to library container
        projectContainer.append(projectTitle, projectNodesContainer);

        

    } catch(err) {
        console.log(err)
    }

}


async function libraryNodes(container, onLoad) {
    //So comment time because i am sure i will forget what i did

    const nodes = await projectServices.PROJECT_TREE("projectTree.js" ,appState.activeProjectPath)

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
                if(node.Children) {
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
