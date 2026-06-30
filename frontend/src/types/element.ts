
export interface ElementData {
    tag: string;
    className?: string;
    id?: string;
    name?: string;
    placement?: string;
    area?: string;
    type?: string;
    text?: string;
    draggable?: string;
    focus?: string;
    path?: string;
    parent: string;
    
}

export interface GraphicElement extends ElementData {
    src: string;
    alt?: string;
}

export interface InputElement extends ElementData {
    placeHolder?: string;
}

export interface ButtonElement extends ElementData {
    disabled?: boolean
}