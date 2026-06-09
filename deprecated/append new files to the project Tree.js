function appendNewFile() {

    const container = get("projectTree", "leftSide", "projectNodesContainer")

    // get new file path
    const newFilePath = appstate.file.newFilePath

    // extract name of the thing
    const nameExtractions = newFilePath.split(/[\\/]/);
    const newFileName = nameExtractions.pop()
    
    const node = {
        name: newFileName,
        path: newFilePath,
    }


    const treeCell = document.createElement("div")
        const folderCell = document.createElement("div")
        const name = document.createElement("p")
        const cellIcon = document.createElement("span")
        
        treeCell.classList.add("node-cell")
        folderCell.classList.add("folder-cell")
        treeCell.dataset.name = node.name
        folderCell.dataset.name = node.name


        name.classList.add("node-name")
        cellIcon.classList.add("material-symbols-outlined", "cell-icon")
        name.dataset.path = node.path


    name.textContent = node.name
            cellIcon.textContent = "description"
            treeCell.append(cellIcon, name)
            name.addEventListener('click', (event) => {
                event.stopPropagation()
                const activeFile = name.dataset.path
                console.log("Path from projectTree.js is:", activeFile)
                appstate.file.path = activeFile
                const payload = {
                    source: "projectTree.js",
                    data: activeFile,
                }
                emit(events.file.req.editor, payload)
                emit(events.file.req.read, payload)
            })
            container.append(treeCell)
}

