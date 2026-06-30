import { Dom } from './services/domServices';
import './style.css';
import './app.css';
import './styles/components/buttons.css'
import './styles/components/inputs.css'
import { StartupView } from './components/startupView';
import { startupServices } from './services/startupServices';

const app = document.getElementById("app");
console.log(app)
if(!app) {
    throw new Error("App element not found.")
}
export const dom = new Dom(app)



class StartUp {

    async start() {
        const configPath = false //await startupServices.configCheck()
        if(!configPath) {
            new StartupView(dom).view()
            return
        }

        const projectConfig = await startupServices.loadLibraryConfig(configPath)
        if(!projectConfig) {

        }

    }
}

const startup = new StartUp()
startup.start()