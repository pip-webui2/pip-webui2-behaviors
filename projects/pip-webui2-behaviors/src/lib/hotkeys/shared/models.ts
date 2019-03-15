import { NavigationExtras } from '@angular/router';

export enum KeyboardEventType {
    Keydown = 'keydown',
    Keyup = 'keyup',
    Keypress = 'keypress'
}

export class HotkeyOptions {
    Type: KeyboardEventType;
    Propagate: boolean;
    DisableInInput: boolean;
    Target: any; // Event target object
    Keycode: number;
}

export class HotkeyItem {
    // Shortcut combination
    public hotkey: string | string[];
    // Target object
    public target?: any;
    // Target element by Id
    public targetId?: string;
    // Access function
    public access?: (event?: KeyboardEvent) => boolean;
    // Window.location.href
    public href?: string;
    // router.navigate(command, extras)
    public navigationCommand?: string | string[];
    // Parameters router.navigate(command, extras)
    public navigationExtras?: NavigationExtras;
    // Click callback
    public action?: (event?: KeyboardEvent) => void;
    // Default options
    public options?: HotkeyOptions;
}
