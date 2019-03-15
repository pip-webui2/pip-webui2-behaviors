export enum KeyboardEventType {
    Keydown = 'keydown',
    Keyup = 'keyup',
    Keypress = 'keypress'
}

export class ShortcutOptions {
    Type: KeyboardEventType;
    Propagate: boolean;
    DisableInInput: boolean;
    Target: any; // Event target object
    Keycode: number;
}
