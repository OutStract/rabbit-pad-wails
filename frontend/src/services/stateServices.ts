import { EventsOn, EventsEmit } from '../../wailsjs/runtime/runtime';
import { Payload } from '../types/payload';
import * as EVENT from '../events/events.ts'
import { LibraryTree } from '../types/libraryTree.ts';
import { getName } from '../utils/pathUtils.ts';

class Appstate {
    
    Initialize() {
        EventsOn(EVENT.UPDATE_STATE, (payload: Payload) => { 
            this.update(payload)
        })
    }

    libraryPath = "";
    libraryName = "";
    libraryConfigPath = "";
    libraryTree: LibraryTree[] = [];
    projectPath = "";
    projectName = "";
    projectTree: unknown[] = [];
    activeFilePath = "";
    activeFileName = "";
    selectedFiles: unknown[] = []
    leftPaneCollapsed = true
    rightPaneCollapsed = true

    update(payload: Payload){
        switch(payload.action) {
            case EVENT.APP_CONFIG_CHECK:
                this.libraryPath = payload.data as string;
                this.libraryName = getName(payload.data as string)
                break
            case EVENT.APP_CONFIG_UPDATE: // Get config file location
                this.libraryConfigPath = payload.data as string;
                break
            case EVENT.LAST_OPENED_PROJECT: // Get last opened project path
                this.projectPath = payload.data as string
                this.projectName = getName(payload.data as string)
                break
            case EVENT.LIB_TREE: 
                this.libraryTree = payload.data as LibraryTree[]
                break
            case EVENT.MAKE_PROJECT:
                EventsEmit(payload.action, payload.data)
        }
    }

}

export const appState = new Appstate()
