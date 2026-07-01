export function getName (path:string): string {
    const pathSplit = path.split(/[\\/]/)
    const name = pathSplit.pop()
    return name as string
}

export function getBasePath(fullPath: string) {
    const pathSplit = fullPath.split(/[\\/]/)
    const name = pathSplit.pop()
    if(fullPath.includes('\\')) {
        const basePath = pathSplit.join('\\')
        return basePath
    }
    const basePath = pathSplit.join('/')
    return basePath
}

export function cleanName(name: string) {
    const nameSplit = name.split('.')
    if(nameSplit.length > 1) {
        nameSplit.pop()
    }
    return nameSplit.join('.')
}

export function updateFilePath(basePath:string, name:string) {
    if(basePath.includes('\\')) {
        const newPath = `${basePath}\\${name}`
        return newPath
    }
    const newPath = `${basePath}/${name}`
    return newPath
}