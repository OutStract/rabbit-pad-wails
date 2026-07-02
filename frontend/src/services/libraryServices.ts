import * as backend from '../../wailsjs/go/services/LibraryServices.js'
import * as EVENT from '../events/events.ts'

import { EventsEmit } from '../../wailsjs/runtime/runtime.js'
import { LibraryTree } from '../types/trees.js'
import { Payload } from '../types/payload.js'
import { appState } from './stateServices.js'

class LibraryServices{

    async makeLibrary(libraryName: string, libraryPath: string): Promise< string | null> {
        const libName = libraryName
        const libPath = libraryPath
        
        const result: Payload = await backend.MakeLib(libName, libPath)

        if(!result.success) {
            console.log(result.message, result.error)

            return null
        }

        EventsEmit(EVENT.UPDATE_STATE, result)
        return result.data as string
    }

    async libraryTree(): Promise<LibraryTree[] | null> {
        const libraryPath = appState.libraryPath
        const result: Payload = await backend.LibTree(libraryPath)
        if(!result.success) {
            // Move the error from return value to modal
            console.log(result.message, result.error)
            // and return null value
            return null
        }    
        EventsEmit(EVENT.UPDATE_STATE, result)
        return result.data as LibraryTree[]
    }
}

export const libraryServices = new LibraryServices()