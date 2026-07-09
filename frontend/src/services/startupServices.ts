import { OpenDirectory } from "../../wailsjs/go/services/DialogServices"
import { LoadLibConfig } from "../../wailsjs/go/services/LibraryServices"
import { ConfigCheck, UpdateConfig } from "../../wailsjs/go/services/StartUpServices"
import { EventsEmit } from "../../wailsjs/runtime/runtime"
import { UPDATE_STATE } from "../events/events.ts"
import { Payload } from "../types/payload"

export class StartUpServices {

    async openDirectory(): Promise<string | null> {
        const result: Payload = await OpenDirectory()
        if(!result.success) {
            // Move the error from return value to modal
            console.log(result.message)
            // and return null value
            return null
        }  
        console.log(result.message)
        return result.data as string
    }

    async updateConfig(libraryName: string, libraryPath: string): Promise< string | null > {
        const result: Payload = await UpdateConfig(libraryName, libraryPath)
        if(!result.success) {
            console.log(result.message)
            return null
        }
        EventsEmit(UPDATE_STATE, result)
        return result.data as string
    }

    async configCheck(): Promise<string | null> {
        // Get library path
        const result: Payload = await ConfigCheck()
        if(!result.success) {
            console.log(result.message)
            return null
        }
        console.log(result.data)
        EventsEmit(UPDATE_STATE, result)
        return result.data as string
    }

    async loadLibraryConfig(libraryPath: string): Promise<string | null> {
        const result: Payload = await LoadLibConfig(libraryPath)
        if(!result.success) {
            console.log(result.message)
            return null
        }
        EventsEmit(UPDATE_STATE, result)
        return result.data as string
    }
}

export const startupServices = new StartUpServices()