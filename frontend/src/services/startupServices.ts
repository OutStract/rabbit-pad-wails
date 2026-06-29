import { OpenDirectory } from "../../wailsjs/go/services/DialogServices"
import { Payload } from "../types/payload"

export class StartUpServices {

    async openDirectory() {
        const result: Payload = await OpenDirectory()
        if(!result.success) {
            return result.message
        }    

        return result.data
    }
    
}

export const startupServices = new StartUpServices()