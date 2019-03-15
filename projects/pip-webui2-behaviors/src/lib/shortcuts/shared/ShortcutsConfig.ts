import { ShortcutItem } from './ShortcutItem';
import { ShortcutOptions } from './ShortcutOptions';

export class ShortcutsConfig {
    /// Global Shortcuts
    public globalShortcuts: ShortcutItem[] = [];
    /// Local shortcuts
    public localShortcuts: ShortcutItem[] = [];
    /// Default options
    public defaultOptions: ShortcutOptions = null;
}

