import { EventsOn, EventsEmit } from '../../wailsjs/runtime/runtime';
import {appstate} from '/src/appstate/appstate.js'
import {logger} from '/src/logs/logger.js'

export const events = {
    RELOAD_APP: "reload-app-startup",
    NEW_PROJECT: "new-project"
}

export function emit(event) {
    console.log("Event emitted", event)
    EventsEmit(event)
}



/*======= START UP SERVICES ========*/

EventsOn("startup-config-found", (message) => {
    const libraryName = message.split(/[\\/]/);
    appstate.library.name = libraryName.pop()
    appstate.library.path = message
    logger.INFO("STARTUP EVENT", "events.js", "Start up config found", message, null)
});


EventsOn("startup-config-update", (message) => {
    appstate.library.configPath = message
    logger.INFO("STARTUP EVENT", "events.js", "Start up config updated", message, null)
});


/*======= LIBRARY SERVICES ========*/

EventsOn("library-created", (message) => {
    appstate.library.path = message
    logger.INFO("LIBRARY EVENT", "events.js", "Library Created", message, null)
})

EventsOn("library-loaded", (message) => {
    appstate.library.tree = message
    logger.INFO("LIBRARY EVENT", "events.js", "Library loaded", message, null)

})

EventsOn("lib-config-found", (message) => {
    
    logger.INFO("LIBRARY EVENT", "events.js", "Library config found", message, null)
})

EventsOn("lib-config-update", (message) => {
    logger.INFO("LIBRARY EVENT", "events.js", "Library config update", message, null)
})

/*======= PROJECT SERVICES ========*/

EventsOn("project-created", (message) => {
    logger.INFO("PROJECT EVENT", "events.js", "Project Created", message, null)
})

EventsOn("project-tree", (message) => {
    logger.INFO("PROJECT EVENT", "events.js", "Project tree", message, null)
})

EventsOn("close-project", () => {
    logger.INFO("PROJECT EVENT", "events.js", "Project Closed", message, null)
})




