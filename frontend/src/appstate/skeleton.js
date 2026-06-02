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
        console.warn(`Element already registerd: ${name}`)
    }
    
    skeleton[block][name] = element
    console.log("Registrations successful", skeleton[block][name] = element)
}

export function get(block, name) {
    if(!skeleton[block]) {
        throw new Error(`Unknown block found ${block}`)
    }

    return skeleton[block][name]
}