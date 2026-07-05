import { EventsOn, EventsEmit } from '../../wailsjs/runtime/runtime';
import { Payload } from '../types/payload';
import * as EVENT from '../events/events.ts'
import { LibraryTree, ProjectTree, RenameData, SelectedPaths } from '../types/trees.ts';
import { getName } from '../utils/pathUtils.ts';
import { LibTree } from '../../wailsjs/go/services/LibraryServices';

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
    projectTree: ProjectTree[] = [];
    activeFilePath = "";
    activeFileName = "";
    
    // Dom STATES
    selectedFiles = new Set()
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

            case EVENT.MAKE_PROJECT: // Append new Project node
            this.libraryTree.push(payload.data as LibraryTree)
                EventsEmit(payload.action, payload.data)
                break

            case EVENT.RENAME_PROJECT: // Update project node
                const data = payload.data as RenameData
                const oldPath = data.oldPath
                const newPath = data.newPath
                const lastMod = data.lastMod
                const oldNode = this.libraryTree.find(node => node.path == oldPath)

                if(oldNode) {
                    oldNode.name = getName(newPath)
                    oldNode.path = newPath
                    oldNode.lastMod = lastMod
                }
                EventsEmit(payload.action, payload.data)
                break

            case EVENT.DELETE_PROJECT: // remove project node
                this.libraryTree = this.libraryTree.filter(node => node.path !== payload.data)
                EventsEmit(payload.action, payload.data)
                break 
                
            case EVENT.PROJECT_TREE: // Project view
                this.projectTree = payload.data as ProjectTree[]
                EventsEmit(payload.action, payload.data)
                break 
        }
    }

}

export const appState = new Appstate()
