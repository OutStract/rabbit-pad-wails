import './style.css';
import './app.css';
import logo from './assets/images/logo.svg'


import { renderHomeContainer } from './scripts/dom/homeContainer';
import { renderHeader } from './scripts/dom/header';
import { renderStartUp } from './scripts/dom/startup'
import { ConfigCheck } from '../wailsjs/go/services/StartUpServices.js';



async function startUpCheck() {
    const configCheck = true //await ConfigCheck()
    if (!configCheck) {
        console.log(configCheck)
        renderStartUp(logo)
        return
    } 
        
    renderHomeContainer();

    console.log(configCheck)
}

startUpCheck()





