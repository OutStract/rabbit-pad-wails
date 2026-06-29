import { Dom } from './services/domServices';
import { ConfigCheck } from '../wailsjs/go/services/StartUpServices';
import './style.css';
import './app.css';
import { StartupView } from './components/startup';

const app = document.getElementById("app");
console.log(app)
if(!app) {
    throw new Error("App element not found.")
}
export const dom = new Dom(app)



class StartUp {

    start() {
        const configData = false //ConfigCheck()
        if(!configData) {
            new StartupView(dom).view()
        }
    }
}

const startup = new StartUp()
startup.start()