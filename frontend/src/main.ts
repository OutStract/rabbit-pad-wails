import { Dom } from './services/domServices';
import { ConfigCheck } from '../wailsjs/go/services/StartUpServices';
import { startupView } from './components/startup';

const app = document.getElementById("app");
if(!app) {
    throw new Error("App element not found.")
}
export const dom = new Dom(app)



class StartUp {

    start() {
        const configData = ConfigCheck()
        if(!configData) {
            startupView.view()
        }
    }
}