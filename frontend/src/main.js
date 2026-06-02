import '/src/events/events.js'

import './style.css';
import './app.css';

import { appstate } from '/src/appstate/appstate.js'
import { register, skeleton } from '/src/appstate/skeleton.js'

import {logger} from '/src/logs/logger.js'
import {startUpServices, libraryServices} from '/src/api/api.js'

import { renderProjectContainer } from '/src/dom/project-page/projectContainer.js';
import { renderHeader } from '/src/dom/project-page/header.js';
import { renderStartUp } from '/src/dom/startup'
import { renderLibrary } from '/src/dom/library/libraryContainer'

import { EventsOn } from '../wailsjs/runtime/runtime';

const app = document.getElementById("app");
register("app","app",app)



async function startUpCheck() {
        // Checking for active library in the configurations file
        const configCheck = await startUpServices.CHECK_CONFIG("main.js")
        if (!configCheck) {
            renderStartUp()
            return
        }

        // Followiing the active library path then goes to check if the library config has active project
        const projectConfig = await libraryServices.LOAD_LIB_CONFIG("main.js",configCheck)

        if(!projectConfig) {
            renderLibrary()
            return
        }

        await renderProjectContainer(app, {onCreate: CreateFile});

}

startUpCheck()



/*========= EVENTS ===========*/




