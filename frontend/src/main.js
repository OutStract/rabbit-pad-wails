import {events, ON} from '/src/events/events.js'

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
import { renderNewProject } from '/src/dom/library/newProjectContainer'

const app = document.getElementById("app");
register("app","app",app)

import './Labours/fileLabours'
import './events/shortcuts'
import './Labours/messageLabour'


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

        renderProjectContainer();

}

startUpCheck()



/*========= EVENTS ===========*/

ON(events.app.reload, {callback: startUpCheck})