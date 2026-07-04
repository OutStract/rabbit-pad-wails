import { Payload } from "../types/payload"
import { appState } from "./stateServices"
import { EventsEmit } from "../../wailsjs/runtime/runtime.js"
import * as backend from '../../wailsjs/go/services/ProjectServices.js'
import * as EVENT from '../events/events.ts'
import { getBasePath, getName } from "../utils/pathUtils.ts"
import { LibraryTree, ProjectTree } from "../types/trees.ts"



class ProjectServices {
    async makeProject(name: string): Promise< LibraryTree | null> {
        const projectName = name
        const libraryPath = appState.libraryPath
        if(!projectName || !libraryPath) {
            // Added modal logs later
            return null
        }
        const result: Payload =  await backend.MakeProject(libraryPath, projectName)
        if(!result.success) {
            console.log(result.message, result.error)
            return null;
        }
        EventsEmit(EVENT.UPDATE_STATE, result)
        return result.data as LibraryTree
    }

    async projectTree(projectRootPath: string): Promise< ProjectTree[] | null> {
        const projectRoot = projectRootPath
        if(!projectRoot) {
            // Added modal logs later
            return null
        }

        const result: Payload = await backend.ProjectTree(projectRoot)

        if(!result.success) {
            console.log(result.message, result.error)
            return null;
        }
        EventsEmit(EVENT.UPDATE_STATE, result)
        return result.data as ProjectTree[]
    }

    async renameProject(oldPath: string, newName: string): Promise<string | null> {
        const oldName = oldPath
        const base = getBasePath(oldPath)
        const name = newName
        if(!oldName || !base || !name) {
            // Added modal logs later
            return null
        }

        const result: Payload = await backend.RenameProject(oldName, base, name)

        if(!result.success) {
            console.log(result.message, result.error)
            return null;
        }
        EventsEmit(EVENT.UPDATE_STATE, result)
        return result.data as string
    }

    async deleteProject(projectPath: string): Promise<string | null> {
        const libraryPath = appState.libraryPath
        const project = projectPath
        const name = getName(project)
        if(!libraryPath || !project || !name) {
            // Added modal logs later
            return null
        }

        const result: Payload = await backend.DeleteProject(libraryPath, project, name)

        if(!result.success) {
            console.log(result.message, result.error)
            return null;
        }
        EventsEmit(EVENT.UPDATE_STATE, result)
        return result.data as string
    }

}

export const projectServices = new ProjectServices()