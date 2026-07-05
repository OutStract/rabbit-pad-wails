
import {startUpServices, libraryServices} from '/src/api/api.js'
import { get, skeleton } from '/src/appstate/skeleton.js'
import {events, emit} from '/src/events/events.js'


import { OpenDirectory } from '../../frontend/wailsjs/go/services/DialogServices.js';

export function renderStartUp () {
    console.log("STARTUP SUCCESS")
    const app = get("startup.js","app", "app")
    //Welcome container
    const welcome = document.createElement("div");
    welcome.id = "welcome"
    //Appednig startup container to app body
    app.append(welcome);

    //Startup Container
    const startup = document.createElement("div");
    startup.classList.add("startup");

    //Logo Div
    const logo = document.createElement("div");
    logo.id = 'logo'
    //Using absolute paths becasue relative paths ./ weren't working 
    //And didn't wanted to drill the logo from main.js
    const logoImg = document.createElement("img");
    logoImg.src = '/src/assets/images/logo.svg';
    logoImg.alt = 'Rabbit Logo'
    logo.append(logoImg)

    // Name and library oprations
    const rightSide = document.createElement("div");
    rightSide.id = "start-r-side"

    //Name
    const name = document.createElement("div");
    name.innerText = "Rabbit Pad";
    name.id = 'rabbit-pad'

    // Library Container
    // const library = document.createElement("div");

    //Library operations container
    const libraryOperations = document.createElement("div");
    libraryOperations.id = "library-operations"

    //==========Library operations============
        //Library Name
        const libraryName = document.createElement("div");
        libraryName.classList.add('msg-container')

        const msg1 = document.createElement("p");
        msg1.innerText = "Name your library";
        msg1.classList.add('msg')

        const libraryInput = document.createElement("input");
        libraryInput.placeholder = "Library Name";
        libraryInput.classList.add('lib-name-startup-input')
        libraryName.append(msg1, libraryInput);

        //Library location
        const libraryLocation = document.createElement("div");
        libraryLocation.classList.add("msg-container")

        const locationContainer = document.createElement("div")

        const msg2 = document.createElement("p");
        msg2.innerText = "Select library location";
        msg2.classList.add('msg')

        const locationText = document.createElement("p")
        locationText.innerText = ""
        locationText.classList.add("path")

        locationContainer.append(msg2)

        const libraryLocationInput = document.createElement("button");
        libraryLocationInput.innerText = "Browse";
        libraryLocationInput.classList.add('start-btn')
        
        libraryLocationInput.addEventListener("click", async () => {
            try {
                
                const result = await OpenDirectory()
                locationContainer.append(locationText)
                locationText.innerText = result


            }
            catch(err) {
                console.log(err)
            }
        })

        
        
        libraryLocation.append(locationContainer, libraryLocationInput);

        //Library create button 
        const libraryCreate = document.createElement("div");
        libraryCreate.classList.add("msg-container")

        const msg3 = document.createElement("p");
        msg3.innerText = "Create your library";
        msg3.classList.add('msg')

        const libraryCreateBtn = document.createElement("button");
        libraryCreateBtn.innerText = "Create";
        libraryCreateBtn.classList.add('start-btn')
        libraryCreateBtn.addEventListener("click", async () => {
            const libName = libraryInput.value
            const libPath = locationText.innerText
            if (!libName || !libPath) {
                alert ("Name or Path Can't be empty")
                return
            }
            await startUpServices.UPDATE_CONFIG("startup.js",libName, libPath)
            await libraryServices.MAKE_LIB("startup.js",libName, libPath)
            emit(events.app.reload, null)
        })
        libraryCreate.append(msg3, libraryCreateBtn);
        

        const seperator = document.createElement("hr")


        /* ================ ADD THIS LATER ============ */
        // Open existing library button
        // const openLibrary = document.createElement("div");
        // openLibrary.classList.add("msg-container")

        // const msg4 = document.createElement("p");
        // msg4.innerText = "Open existing library";
        // msg4.classList.add('msg')

        // const openLibraryBtn = document.createElement("button");
        // openLibraryBtn.innerText = "Open";
        // openLibraryBtn.classList.add('start-btn')
        // openLibrary.append(msg4, openLibraryBtn);


    //Appednig library operations to library container
    libraryOperations.append(libraryName, libraryLocation, libraryCreate);

    // Appending to right side
    rightSide.append(name, libraryOperations);

    // Appending both sides to startup
    startup.append(logo, rightSide);

    // Appending label and startup to welcome container
    welcome.append(startup);

    
}