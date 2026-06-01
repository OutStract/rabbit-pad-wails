import { EventsOn } from '../../wailsjs/runtime/runtime';

export const appState = [
    {
        "libraryName" : "library",
        "libraryPath" : ""

    },
    {
        "projectName" : "",
        "activeProjectPath" : ""
    },
    {"libraryTree" : ""}
]

EventsOn("config-found", (message) => {
    const nameSplit = message.split(/[\\/]/)
    const nameExtract = nameSplit.pop()
    appState.libraryName = nameExtract
    appState.libraryPath = message
});

EventsOn("library-loaded", (message) => {
    appState.libraryTree = message
})

EventsOn("open-project", (path) => {
    const nameSplit = path.split(/[\\/]/)
    const nameExtract = nameSplit.pop()
    appState.projectName = nameExtract

    
})

EventsOn("lib-config-update", (message) => {
    console.log("Message from library config update:", message)
})


EventsOn("lib-config-found", (message) => {
    console.log("Message from library config update:", message)
    appState.activeProjectPath = message
})