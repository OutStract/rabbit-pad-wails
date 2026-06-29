import * as backend from '../../wailsjs/go/services/FileServices.js'
import { appState } from './stateServices.js'

export class FileServices {
    private backend = backend
    private projectPath = appState.projectPath
}