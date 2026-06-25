export function getName (path) {
    const pathSplit = path.split(/[\\/]/)
    const name = pathSplit.pop()
    return name
}

export function getBasePath(fullPath) {
    const pathSplit = fullPath.split(/[\\/]/)
    const name = pathSplit.pop()
    if(fullPath.includes('\\')) {
        const basePath = pathSplit.join('\\')
        return basePath
    }
    const basePath = pathSplit.join('/')
    return basePath
}

export function cleanName(name) {
    const nameSplit = name.split('.')
    if(nameSplit.length > 1) {
        nameSplit.pop()
    }
    return nameSplit.join('.')
}

export function updateFilePath(basePath, name) {
    if(basePath.includes('\\')) {
        const newPath = `${basePath}\\${name}`
        return newPath
    }
    const newPath = `${basePath}/${name}`
    return newPath
}