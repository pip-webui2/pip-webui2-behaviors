import { Injectable, InjectionToken, Inject } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';

import { ShortcutOptions, KeyboardEventType } from './ShortcutOptions';
import { Shortcut } from './Shortcut';

export const SHORTCUTS_DEFAULT_OPTIONS = new InjectionToken<ShortcutOptions>('Shortcut default options');

export const shortcutsDefaultProvider = {
    provide: SHORTCUTS_DEFAULT_OPTIONS,
    useValue: {
        Type: KeyboardEventType.Keydown,
        Propagate: false,
        DisableInInput: false,
        Target: document,
        Keycode: null
    }
};

export interface IShortcutsDictionary {
    [shortcut: string]: Shortcut;
}

@Injectable()
export class PipShortcutsBindingService {

    private _defaultOption: ShortcutOptions = {
        Type: KeyboardEventType.Keydown,
        Propagate: false,
        DisableInInput: false,
        Target: document,
        Keycode: null
    };
    private _shortcuts: IShortcutsDictionary = {};

    public constructor(
        @Inject(SHORTCUTS_DEFAULT_OPTIONS) option: ShortcutOptions,
    ) {

        this._defaultOption = option ? Object.assign(option, cloneDeep(this._defaultOption)) : cloneDeep(this._defaultOption);
    }

    public get shortcuts(): IShortcutsDictionary {
        return this._shortcuts;
    }

    public add(shortcut: string, callback: (e: KeyboardEvent) => void, option: ShortcutOptions): void {
        this.remove(shortcut);
        const shortcutOption: ShortcutOptions = option
            ? Object.assign(option, cloneDeep(this._defaultOption)) : cloneDeep(this._defaultOption);
        const shortcutCombination: string = shortcut.toLowerCase();
        let element = shortcutOption.Target;

        if (typeof shortcutOption.Target === 'string') {
            element = document.getElementById(shortcutOption.Target);
        } else {
            element = shortcutOption.Target;
        }

        if (!element || !shortcutCombination || !callback) {
            return;
        }

        const newKeyboardShortcut = new Shortcut(element, shortcutCombination, shortcutOption, callback);

        this._shortcuts[shortcutCombination] = newKeyboardShortcut;

        // Attach the function with the event
        if (element.addEventListener) {
            element.addEventListener(shortcutOption.Type, newKeyboardShortcut.eventCallback, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + shortcutOption.Type, newKeyboardShortcut.eventCallback);
        } else {
            element.on(shortcutOption.Type, newKeyboardShortcut.eventCallback);
        }
    }

    public remove(shorcut: string): void {
        const shortcutCombination = shorcut.toLowerCase();
        const binding: Shortcut = this._shortcuts[shortcutCombination];

        delete (this._shortcuts[shortcutCombination]);
        if (!binding) { return; }

        const type = binding.event;
        const element = binding.target;
        const callback = binding.eventCallback;

        if (element.detachEvent) {
            element.detachEvent('on' + type, callback);
        } else if (element.removeEventListener) {
            element.removeEventListener(type, callback, false);
        } else {
            // element['on' + type] = false;
            element.off(type, callback);
        }
    }
}
