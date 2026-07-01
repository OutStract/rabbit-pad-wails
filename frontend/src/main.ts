import { DOM } from './services/domServices';
import './style.css';
import './app.css';
import './styles/components/buttons.css'
import './styles/components/inputs.css'
import { renderStartup } from './components/startupView';
import { startupServices } from './services/startupServices';
import { appBody } from './components/appBody';
import { LibraryView, renderLibrary } from './components/libraryView';
import { renderFooter } from './components/footer';
import { renderHeader } from './components/header';
import { libraryServices } from './services/libraryServices';
import { appState } from './services/stateServices';

const app = document.getElementById("app");
if(!app) {
    throw new Error("App element not found.")
}

appState.Initialize()


class StartUp {

    async start() {
        const configPath = await startupServices.configCheck()
        if(!configPath) {
            renderStartup.build()
            return
        }

        appBody.build()
        renderHeader.build()

        await libraryServices.libraryTree()
        
        const projectConfig = false //await startupServices.loadLibraryConfig(configPath)
        if(!projectConfig) {
            renderLibrary.build()
        }
        
    }
}

const startup = new StartUp()
startup.start()