export interface LibraryTree {
    name: string,
    path: string,
    lastMod: string,
}

export interface ProjectTree {
    name: string,
    path: string,
    isFolder: boolean,
    children: ProjectTree[] | null
}

export interface RenameData {
    oldPath: string,
    newPath: string,
    lastMod: string,
}

export interface SelectedPaths {
    name: string,
    path: string,
    isFolder: boolean
}

