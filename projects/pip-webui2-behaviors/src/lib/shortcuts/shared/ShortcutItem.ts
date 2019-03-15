import { NavigationExtras } from '@angular/router';
import { ShortcutOptions } from './ShortcutOptions';

export class ShortcutItem {
    // Shortcut combination
    public shortcut: string;
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
    public options?: ShortcutOptions;
}
