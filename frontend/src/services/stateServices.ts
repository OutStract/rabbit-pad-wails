import { EventsOn, EventsEmit } from '../../wailsjs/runtime/runtime';
import { Payload } from '../types/payload';
import * as EVENT from '../events/events.ts'

class Appstate {
    libraryPath = "";
    libraryNam = "";
    libraryConfigPath = "";
    libraryTree: unknown[] = [];
    projectPath = "";
    projectName = "";
    projectTree: unknown[] = [];
    newProjectPath = "";
    activeFilePath = "";
    activeFileName = "";
    selectedFiles: unknown[] = []

    Initialize() {
        EventsOn(EVENT.UPDATE_STATE, (payload: Payload) => { 
            this.update(payload)
        })
    }

    update(payload: Payload){
        switch(payload.action) {
            case EVENT.APP_CONFIG_CHECK:
                this.libraryPath = payload.data as string;
                break
            case EVENT.APP_CONFIG_UPDATE: // Get config file location
                this.libraryConfigPath = payload.data as string;
                break
            case EVENT.LAST_OPENED_PROJECT: // Get last opened project path
                this.projectPath = payload.data as string
                break
        }
    }

}

export const appState = new Appstate()
appState.Initialize()