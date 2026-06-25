export const skeleton = {
    app: {},
    header: {},
    leftSide: {},
    middle: {},
    rightSide: {},
    library: {}
}

export function register (block, name, element) {
    if(!skeleton[block]) {
        throw new Error(`Unknown block registrations ${block}`)
    }

    if(skeleton[block][name]) {
        // console.log(`Overwriting : ${block}.${name}`)
    }
    
    skeleton[block][name] = element
}

export function get(file, block, name) {
    if(!skeleton[block]) {
        throw new Error(`Unknown block found ${block}`)
    }

    // console.log( name, `"GET" successful for ${file}` , "Conected?", skeleton[block][name]?.isConnected)

    return skeleton[block][name]
}