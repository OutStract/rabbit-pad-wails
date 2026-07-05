import {events, emit} from '/src/events/events.js'
import { appstate } from '/src/appstate/appstate'

const payload = {
    source: "shortcuts",
    data: {
        selections: appstate.file.selectionList
    }
}

window.addEventListener('keydown', (event) => {

    if(event.key === 'Delete') {
        emit(events.file.req.delete, payload)
    }

    
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
        emit(events.file.req.rename, payload)
    }
})