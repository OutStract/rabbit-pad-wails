import {events, emit} from '/src/events/events.js'

const payload = {
    source: "shortcuts"
}

window.addEventListener('keydown', (event) => {

    if(event.key === 'Delete') {
        emit(events.file.req.delete, payload)
    }

    
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
        emit(events.file.req.rename, payload)
    }
})