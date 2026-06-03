import {logger} from '/src/logs/logger.js'

import { ConfigCheck, UpdateConfig  } from '../../wailsjs/go/services/StartUpServices.js';
import { MakeLib, LibTree, LoadLibConfig, UpdateLibConfig } from '../../wailsjs/go/services/LibraryServices.js';
import { MakeProject, ProjectTree } from '../../wailsjs/go/services/ProjectServices.js';
import { CreateFile, ReadFile } from '../../wailsjs/go/services/FileServices.js';

// FROM FRONTEND TO BACKEND
export const startUpServices = {
    CHECK_CONFIG : configCheck,
    UPDATE_CONFIG: updateConfig
}

export const libraryServices = {
    MAKE_LIB: makeLib,
    LIB_TREE: libTree,
    LOAD_LIB_CONFIG: loadLibConfig,
    UPDATE_LIB_CONFIG: updateLibConfig
}

export const projectServices = {
    MAKE_PROJECT: makeProject,
    PROJECT_TREE: projectTree

}

export const fileServices = {
    CREATE_FILE: createFile,
    READ_FILE: readFile
}
/*======= START UP SERVICES ========*/

async function configCheck (fileName) {

    const start = performance.now()
    try{ 
        logger.INFO("STARTUP", fileName, "Loading Rabbit Pad", null, performance.now() - start)
        logger.INFO("CHECK", fileName, "checking startup configurations", null, performance.now() - start)

        const result = await ConfigCheck()

        logger.INFO("CONPLETED", fileName, "Check completed", result, performance.now() - start)
        return result
    }
    catch(err) {
        logger.ERROR(err)
    }
}

async function updateConfig (fileName, libraryName, libraryPath) {

    const start = performance.now()
    try{ 
        logger.INFO("UPDATE", fileName, "Updating startup configurations", null, performance.now() - start)

        const result = await UpdateConfig(libraryName, libraryPath)

        logger.INFO("COMPLETED", fileName, "Update completed", result, performance.now() - start)
        return result
    }
    catch(err) {
        logger.ERROR(err)
    }
}


/*======= LIBRARY SERVICES ========*/


async function makeLib (fileName, libraryName, libraryPath) {

    const start = performance.now()
    try{ 
        logger.INFO("MAKE", fileName, "Making author libray", null, performance.now() - start)

        const result = await MakeLib(libraryName, libraryPath)

        logger.INFO("COMPLETED", fileName, "Library setup completed", result, performance.now() - start)
        return result
    }
    catch(err) {
        logger.ERROR(err)
    }
}

async function libTree (fileName, libraryRoot) {

    const start = performance.now()
    try{ 
        logger.INFO("CHECK", fileName, "Loading author libray", null, performance.now() - start)

        const result = await LibTree(libraryRoot)

        logger.INFO("COMPLETED", fileName, "Library loaded", result, performance.now() - start)
        return result
    }
    catch(err) {
        logger.ERROR(err)
    }
}

async function loadLibConfig (fileName, libraryPath) {

    const start = performance.now()
    try{ 
        logger.INFO("CHECK", fileName, "Loading libray configurations", null, performance.now() - start)

        const result = await LoadLibConfig(libraryPath)

        logger.INFO("COMPLETED", fileName, "Library configurations checked", result, performance.now() - start)
        return result
    }
    catch(err) {
        logger.ERROR(err)
    }
}

async function updateLibConfig (fileName, libraryPath, activeProject) {

    const start = performance.now()
    try{ 
        logger.INFO("UPDATE", fileName, "Updating libray configurations", null, performance.now() - start)

        const result = await UpdateLibConfig(libraryPath, activeProject)

        logger.INFO("COMPLETED", fileName, "Library configurations updated", result, performance.now() - start)
        return result
    }
    catch(err) {
        logger.ERROR(err)
    }
}


/*======= PROJECT SERVICES ========*/


async function makeProject (fileName, libraryPath, projectName) {

    const start = performance.now()
    try{ 
        logger.INFO("MAKE", fileName, "Making new project", null, performance.now() - start)

        const result = await MakeProject(libraryPath, projectName)

        logger.INFO("COMPLETED", fileName, "Project is created", result, performance.now() - start)
        return result
    }
    catch(err) {
        logger.ERROR(err)
    }
}

async function projectTree (fileName, libraryPath, projectName) {

    const start = performance.now()
    try{ 
        logger.INFO("MAKE", fileName, "Making new project", null, performance.now() - start)

        const result = await ProjectTree(libraryPath, projectName)

        logger.INFO("COMPLETED", fileName, "Project is created", result, performance.now() - start)
        return result
    }
    catch(err) {
        logger.ERROR(err)
    }
}


/*======= FILE SERVICES ========*/


async function createFile (fileName, projectPath) {

    const start = performance.now()
    try{ 
        logger.INFO("MAKE", fileName, "Making new file", null, performance.now() - start)

        const result = await CreateFile(projectPath)

        logger.INFO("COMPLETED", fileName, "File is created", result, performance.now() - start)
        return {
            success: true,
            data: result,
            message: "File created successfully"
        }
    }
    catch(err) {
        logger.ERROR(err)

        return {
            success: false,
            data: err,
            message: "Unable to create file"
        }
    }
}


async function readFile (fileName, filePath) {

    const start = performance.now()
    try{ 
        logger.INFO("MAKE", fileName, "Opening file", null, performance.now() - start)

        const result = await ReadFile(filePath)

        logger.INFO("COMPLETED", fileName, "File is opened", result, performance.now() - start)
        return {
            success: true,
            data: result,
            message: "File created successfully"
        }
    }
    catch(err) {
        logger.ERROR(err)

        return {
            success: false,
            data: err,
            message: "Unable to create file"
        }
    }
}