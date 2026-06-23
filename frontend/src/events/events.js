import { EventsOn, EventsEmit } from '../../wailsjs/runtime/runtime';
import {appstate} from '/src/appstate/appstate.js'
import {logger} from '/src/logs/logger.js'

export const events = {
    app: {
        reload: "reload-app-startup",
    },
    project: {
        req: {
            create: "new-project",
            open: "open-project",
            close: "close-project"
        },
        res: {
            created: "new-project-created"
        },
    }, 
    file: {
        req: {
            read: "read-file",
            editor: "render-editor"
        },
        res: {
            created: "new-file",
            moved: "file-moved",
            deleted: "file-deleted",
            renamed: "file-renamed"
        }
    }
}

export function emit(event, payload) {
    console.log("Event emitted", event, "from", payload.source)
    EventsEmit(event, payload)
}

export function ON(event, {callback}) {
    EventsOn(event,  () => {
        callback()
    })
}

/*======= FRONTEND EVENTS ========*/

EventsOn("open-project", (message) => {
    logger.INFO("OPEN PROJECT EVENT", "events.js", "Project is opend", message, null)
})

EventsOn("close-project", (message) => {
    logger.INFO("PROJECT EVENT", "events.js", "Project Closed", message, null)
})

EventsOn("new-project", (message) => {
    logger.INFO("PROJECT EVENT", "events.js", "Create Project", message, null)
})

// EventsOn("read-file", (payload) => {
//     logger.INFO("FILE EVENT", "events.js", "read file", payload.data, null)
// })

// EventsOn(events.file.req.editor, (payload) => {
//     logger.INFO("EDITOR EVENT", "events.js", "Render Editor", payload.data, null)
// })


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
    const projectname = message.split(/[\\/]/);
    appstate.project.name = projectname.pop()
    appstate.project.path = message
    logger.INFO("LIBRARY EVENT", "events.js", "Library config found", message, null)
})

EventsOn("lib-config-update", (message) => {
    const projectname = message.split(/[\\/]/);
    appstate.project.name = projectname.pop()
    appstate.project.path = message
    logger.INFO("LIBRARY EVENT", "events.js", "Library config update", message, null)
})

/*======= PROJECT SERVICES ========*/

EventsOn("project-created", (message) => {
    logger.INFO("PROJECT EVENT", "events.js", "Project Created", message, null)
    appstate.project.newProjectPath = message
    const payload = {
        source: "events.js",
        data: null,
    }
    emit(events.project.res.created, payload)
})

EventsOn("project-tree", (message) => {
    appstate.project.tree = message
    logger.INFO("PROJECT EVENT", "events.js", "Project tree", message, null)
})

/*======= FILE SERVICES ========*/

EventsOn("file-created", (message) => {
    const payload = {
        source: "events.js",
        data: null,
    }
    appstate.file.newFilePath = message
    emit(events.file.res.created, payload)
    logger.INFO("FILE EVENT", "events.js", "File Created", message, null)
})

EventsOn("file-opened", (message) => {
    logger.INFO("FILE EVENT", "events.js", "File Opened", message, null)
})

EventsOn("file-saved", (message) => {
    logger.INFO("FILE EVENT", "events.js", "File Saved", message, null)
})

EventsOn("file-moved", (message) => {
    logger.INFO("FILE EVENT", "events.js", "File moved", message, null)
})

EventsOn("file-deleted", (message) => {
    logger.INFO("FILE EVENT", "events.js", "File deleted", message, null)
})

EventsOn("file-renamed", (message) => {
    logger.INFO("FILE EVENT", "events.js", "File deleted", message, null)
})
