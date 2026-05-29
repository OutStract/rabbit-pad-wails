const sampleProject = [
    {
        "Name": "NewTest.md",
        "Path": "NewTest.md",
        "IsFolder": false
    },
    {
        "Name": "data",
        "Path": "data",
        "IsFolder": true,
        "Children": [
            {
                "Name": "Something.md",
                "Path": "data/Something.md",
                "IsFolder": false
            }
        ]
    },
    {
        "Name": "go.mod",
        "Path": "go.mod",
        "IsFolder": false
    },
    {
        "Name": "main.go",
        "Path": "main.go",
        "IsFolder": false,
        "Children:": []
    },
    {
        "Name": "services",
        "Path": "services",
        "IsFolder": true,
        "Children": [
            {
                "Name": "file.go",
                "Path": "services/file.go",
                "IsFolder": false
            },
            {
                "Name": "file2.go",
                "Path": "services/file.go",
                "IsFolder": true,
                "Children": [
                    {
                        "Name": "file.go",
                        "Path": "services/file.go",
                        "IsFolder": false
                    },
                    {
                        "Name": "file.go",
                        "Path": "services/file.go",
                        "IsFolder": false
                    }
                ]
            }
        ]
    },
    {
        "Name": "test.md",
        "Path": "test.md",
        "IsFolder": false
    }
]

export function renderProjectTree(containerLeft) {
    const projectName = "Myth Archives"

    
    //Library Tree Container
    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-container");
    
    //Appending to right side container
    containerLeft.appendChild(projectContainer);

    //Library Title
    const projectTitle = document.createElement("h2");
    projectTitle.textContent = projectName;
    projectTitle.classList.add("project-title")

    //Library Nodes Container
    const projectNodesContainer = document.createElement("div");
    projectNodesContainer.id = 'project-nodes-container'

    libraryNodes(sampleProject, projectNodesContainer)

    //Appending to library container
    projectContainer.append(projectTitle, projectNodesContainer);

}

function libraryNodes(nodes, container) {

    //So comment time because i am sure i will forget what i did

    nodes.forEach ( node => { // Simple taking the json file of all the folders and moveing them one by one in a loop

        let folderIsOpen = false
        
        function openFolder() {
            folderIsOpen = !folderIsOpen
        }
        const name = document.createElement("p")
        name.textContent = node.Name
        name.classList.add ("tree-node")
        name.dataset.filepath = node.Path
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
            const children = node.Children

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

        console.log(!node.Children)

            if (node.Children) {
            container.append(childrenBlock)  // This is a check to make sure only folders WITH children get the storage space, keeping the dom clean
        }

    })  
}
