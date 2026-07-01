import { Payload } from "../types/payload"
import { appState } from "./stateServices"
import { EventsEmit } from "../../wailsjs/runtime/runtime.js"
import * as backend from '../../wailsjs/go/services/ProjectServices.js'
import * as EVENT from '../events/events.ts'



class ProjectServices {
    async makeProject(name: string): Promise<string | null> {
        const projectName = name
        const libraryPath = appState.libraryPath

        const result: Payload =  await backend.MakeProject(libraryPath, projectName)

        if(!result.success) {
            console.log(result.message, result.error)

            return null;
        }

        EventsEmit(EVENT.UPDATE_STATE, result)
        return result.data as string

    }
}