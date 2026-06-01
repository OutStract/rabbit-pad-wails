import './style.css';
import './app.css';
import { EventsOn } from '../wailsjs/runtime/runtime';
import {appState} from './scripts/cache.js'
const app = document.getElementById("app");



import { renderProjectContainer } from './scripts/dom/project-page/projectContainer.js';
import { renderHeader } from './scripts/dom/project-page/header.js';
import { renderStartUp } from './scripts/dom/startup'
import { renderLibrary } from './scripts/dom/library/libraryContainer'
import { ConfigCheck, UpdateConfig  } from '../wailsjs/go/services/StartUpServices.js';
import { MakeLib, LoadLib, LoadLibConfig, UpdateLibConfig } from '../wailsjs/go/services/LibraryServices.js';
import { MakeProject, ReadProject } from '../wailsjs/go/services/ProjectServices.js';


async function startUpCheck() {

    try{

        const configCheck = await ConfigCheck()
        console.log("MAIN.JS", "STARTUP UP", "CONFIG CHECK", configCheck)

        if (!configCheck) {
            renderStartUp(app, {onCreate: UpdateConfig, forLib: MakeLib})
            return
        } 

        const projectConfig = await LoadLibConfig(configCheck)
        console.log("MAIN.JS", "LIBRARY", "CONFIG CHECK", projectConfig)

        if(!projectConfig) {
            const libraryNodes = await LoadLib(configCheck)
            await renderLibrary(app,libraryNodes, {makeProject: MakeProject, updateConfig: UpdateLibConfig})
            return
        }

        await renderProjectContainer(app, {onLoad: ReadProject});

    
    } 
    catch(err) {
        console.log(err)
    }
    
    
}

startUpCheck()



/*========= EVENTS ===========*/


EventsOn("config-update", (message) => {
    console.log("Message configUpdate function:", message);

    app.innerHTML = ""
    startUpCheck() 
});

EventsOn("project-created", async () => {
    const configCheck = await ConfigCheck()
    const libraryNodes = await LoadLib(configCheck)
    renderLibrary(app,libraryNodes, {makeProject: MakeProject})
    console.log("Lib reload")
})

EventsOn("config-found", (message) => {
    console.log("Message from configCheck function:", message);
});

EventsOn("library-created", (message) => {
    console.log("Message from the library function:", message)
})

EventsOn("library-loaded", (message) => {
    console.log("Message from the load library function:", message)
})

EventsOn("project-read", (message) => {
    
})

EventsOn("lib-config-update", (message) => {
    console.log("Message from library config update:", message)
    app.innerHTML = ""
    startUpCheck()
})


EventsOn("lib-config-found", (message) => {
    console.log("Message from Load Library config:", message)
})

