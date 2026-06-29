import { EventsOn, EventsEmit } from '../../wailsjs/runtime/runtime';


interface Payload {
    id: string;
    success: boolean;
    action: string;
    error: unknown;
    message: string;
    data: unknown;
}

class Appstate {
    libraryPath = "";
    libraryNam = "";
    libraryConfigPath = "";
    libraryTree: unknown[] = [];
    projectPath = "";
    projectName = "";
    newProjectPath = "";
    activeFilePath = "";
    activeFileName = "";
    selectedFiles: unknown[] = []

    Initialize() {
        EventsOn("UPDATE_STATE", (payload: Payload) => { 
            this.update(payload)
        })
    }

    update(payload: Payload){
        switch(payload.action) {
            case "RABBIT_CONFIG_CHECK":
                this.libraryPath = payload.data as string;
                break
            case "RABBIT_CONFIG_UPDATE":
                this.libraryConfigPath = payload.data as string;
                break
        }
    }

}

export const appState = new Appstate()
appState.Initialize()