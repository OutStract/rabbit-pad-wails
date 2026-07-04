
export interface ElementData {
    tag: string;
    className?: string;
    id?: string;
    name?: string;
    placement?: string;
    area?: string;
    text?: string;
    draggable?: string;
    focus?: string;
    path?: string;
    parent?: string;
    tabIndex?: number;
    
}

export interface GraphicElement extends ElementData {
    src: string;
    alt?: string;
}

export interface InputElement extends ElementData {
    placeHolder?: string;
    type?: string;
}

export interface ButtonElement extends ElementData {
    disabled?: boolean
}