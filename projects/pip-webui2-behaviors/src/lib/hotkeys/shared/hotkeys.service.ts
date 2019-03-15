import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';

import { HotkeyItem, HotkeyOptions, KeyboardEventType } from './models';

enum ListenerType {
    addEventListener,
    attachEvent
}

class ListenerItem {
    combo: string;
    element: any;
    listenerType: ListenerType;
    type: string;
    listener: Function;
}

class HotkeysItem {
    hotkey: HotkeyItem;
    listeners: ListenerItem[];

    constructor() { this.listeners = []; }
}

class HotkeysMap {
    [hotkey: string]: HotkeysMapItem;
}

class HotkeysMapItem {
    hotkeysIdx: number;
    listenersIdx: number;
}

@Injectable()
export class PipHotkeysService implements OnDestroy {

    private _defaultOptions: HotkeyOptions = {
        Type: KeyboardEventType.Keydown,
        Propagate: false,
        DisableInInput: false,
        Target: document,
        Keycode: null
    };
    private _hotkeys: HotkeysItem[] = [];
    private _hotkeysMap: HotkeysMap = new HotkeysMap();
    private shift_nums = {
        '`': '~',
        '1': '!',
        '2': '@',
        '3': '#',
        '4': '$',
        '5': '%',
        '6': '^',
        '7': '&',
        '8': '*',
        '9': '(',
        '0': ')',
        '-': '_',
        '=': '+',
        ';': ':',
        '\'': '"',
        ',': '<',
        '.': '>',
        '/': '?',
        '\\': '|'
    };

    private special_keys = {
        'esc': 27,
        'escape': 27,
        'tab': 9,
        'space': 32,
        'return': 13,
        'enter': 13,
        'backspace': 8,

        'scrolllock': 145,
        'scroll_lock': 145,
        'scroll': 145,
        'capslock': 20,
        'caps_lock': 20,
        'caps': 20,
        'numlock': 144,
        'num_lock': 144,
        'num': 144,

        'pause': 19,
        'break': 19,

        'insert': 45,
        'home': 36,
        'delete': 46,
        'end': 35,

        'pageup': 33,
        'page_up': 33,
        'pu': 33,

        'pagedown': 34,
        'page_down': 34,
        'pd': 34,

        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,

        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123
    };

    constructor(
        private router: Router
    ) { }

    ngOnDestroy() {
        for (const hk of this._hotkeys) {
            for (const item of hk.listeners) {
                this._unregisterEvent(item);
            }
        }
    }

    private _hasHotkey(hotkey: string | string[]) {
        return Array.isArray(hotkey)
            ? hotkey.filter(h => Object.keys(this._hotkeysMap).includes(h.replace(/ /g, ''))).length > 0
            : Object.keys(this._hotkeysMap).includes(hotkey.replace(/ /g, ''));
    }

    private _unregisterEvent(item: ListenerItem) {
        switch (item.listenerType) {
            case ListenerType.addEventListener:
                if (item.element.removeEventListener) {
                    item.element.removeEventListener(item.type, item.listener);
                }
                break;
            case ListenerType.attachEvent:
                if (item.element.detachEvent) {
                    item.element.detachEvent('on' + item.type, item.listener);
                }
                break;
        }
    }

    public add(hotkey: HotkeyItem) {
        if (this._hasHotkey(hotkey.hotkey)) { return; }
        const item = new HotkeysItem();
        item.hotkey = hotkey;
        const shortcutOption: HotkeyOptions = hotkey.options
            ? Object.assign(hotkey.options, cloneDeep(this._defaultOptions)) : cloneDeep(this._defaultOptions);
        let element = shortcutOption.Target;

        if (typeof shortcutOption.Target === 'string') {
            element = document.getElementById(shortcutOption.Target);
        } else {
            element = shortcutOption.Target;
        }

        if (!element) {
            return;
        }
        const combos = Array.isArray(hotkey.hotkey) ? hotkey.hotkey : [hotkey.hotkey];
        for (let combo of combos) {
            combo = combo.replace(/ /g, '');
            const listener = (event?: KeyboardEvent) => {
                const e: KeyboardEvent = event || <KeyboardEvent>window.event;
                const modifiers = {
                    shift: { wanted: false, pressed: false },
                    ctrl: { wanted: false, pressed: false },
                    alt: { wanted: false, pressed: false },
                    meta: { wanted: false, pressed: false }	// Meta is Mac specific
                };
                let code: number;

                if (shortcutOption.DisableInInput) { // Disable shortcut keys in Input, Textarea fields
                    let el;
                    if (e.target) {
                        el = e.target;
                    } else if (e.srcElement) {
                        el = e.srcElement;
                    }

                    if (el.nodeType === 3) {
                        el = el.parentNode;
                    }
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { return; }
                }
                // Find Which key is pressed
                if (e.keyCode) {
                    code = e.keyCode;
                } else if (e.which) {
                    code = e.which;
                }

                let character = String.fromCharCode(code).toLowerCase();

                if (code === 188) { character = ','; } // If the user presses, when the type is onkeydown
                if (code === 190) { character = '.'; } // If the user presses, when the type is onkeydown

                const keys: string[] = combo.split('+');
                // Key Pressed - counts the number of valid keypresses - if it is
                // same as the number of keys, the shortcut function is invoked
                let kp = 0;

                if (e.ctrlKey) { modifiers.ctrl.pressed = e.ctrlKey; }
                if (e.shiftKey) { modifiers.shift.pressed = e.shiftKey; }
                if (e.altKey) { modifiers.alt.pressed = e.altKey; }
                if (e.metaKey) { modifiers.meta.pressed = e.metaKey; }

                let i = 0;
                for (i = 0; i < keys.length; i++) {
                    const k: string = keys[i];
                    // Modifiers
                    if (k === 'ctrl' || k === 'control') {
                        kp++;
                        modifiers.ctrl.wanted = true;
                    } else if (k === 'shift') {
                        kp++;
                        modifiers.shift.wanted = true;
                    } else if (k === 'alt') {
                        kp++;
                        modifiers.alt.wanted = true;
                    } else if (k === 'meta') {
                        kp++;
                        modifiers.meta.wanted = true;
                    } else if (k.length > 1) { // If it is a special key
                        if (this.special_keys[k] === code) {
                            kp++;
                        }
                    } else if (shortcutOption.Keycode) {
                        if (shortcutOption.Keycode === code) { kp++; }
                    } else { // The special keys did not match
                        if (character === k) { kp++; } else {
                            if (this.shift_nums[character] && e.shiftKey) { // Stupid Shift key bug created by using lowercase
                                character = this.shift_nums[character];
                                if (character === k) {
                                    kp++;
                                }
                            }
                        }
                    }
                }

                if (kp === keys.length &&
                    modifiers.ctrl.pressed === modifiers.ctrl.wanted &&
                    modifiers.shift.pressed === modifiers.shift.wanted &&
                    modifiers.alt.pressed === modifiers.alt.wanted &&
                    modifiers.meta.pressed === modifiers.meta.wanted) {

                    if (hotkey.access && typeof hotkey.access === 'function') {
                        if (!hotkey.access(event)) {
                            return;
                        }
                    }

                    if (hotkey.action) {
                        hotkey.action(event);
                        return;
                    }

                    if (hotkey.href) {
                        window.location.href = hotkey.href;
                        return;
                    }

                    if (hotkey.navigationCommand) {
                        this.router.navigate(
                            Array.isArray(hotkey.navigationCommand) ? hotkey.navigationCommand : [hotkey.navigationCommand],
                            hotkey.navigationExtras
                        );
                        return;
                    }

                    if (!shortcutOption.Propagate) { // Stop the event
                        // e.cancelBubble is supported by IE - this will kill the bubbling process.
                        e.cancelBubble = true;
                        e.returnValue = false;

                        // e.stopPropagation works in Firefox.
                        if (e.stopPropagation) {
                            e.stopPropagation();
                            e.preventDefault();
                        }

                        return false;
                    }
                }
                modifiers.ctrl.pressed = false;
                modifiers.shift.pressed = false;
                modifiers.alt.pressed = false;
                modifiers.meta.pressed = false;
            };

            // Attach the function with the event
            if (element.addEventListener) {
                element.addEventListener(shortcutOption.Type, listener, false);
                item.listeners.push({
                    combo,
                    listener,
                    type: shortcutOption.Type,
                    element,
                    listenerType: ListenerType.addEventListener
                });
            } else {
                element.attachEvent('on' + shortcutOption.Type, listener);
                item.listeners.push({
                    combo,
                    listener,
                    type: shortcutOption.Type,
                    element,
                    listenerType: ListenerType.attachEvent
                });
            }
            this._hotkeysMap[combo] = {
                hotkeysIdx: this._hotkeys.length,
                listenersIdx: item.listeners.length - 1
            };
        }
        this._hotkeys.push(item);

    }

    public remove(hotkey: string | string[]) {
        const combos = Array.isArray(hotkey) ? hotkey : [hotkey];
        for (let combo of combos) {
            combo = combo.replace(/ /g, '');
            if (!this._hasHotkey(combo)) { continue; }
            const key = Object.keys(this._hotkeysMap).find(k => k === combo);
            if (key) {
                const ref = this._hotkeysMap[key];
                this._unregisterEvent(this._hotkeys[ref.hotkeysIdx].listeners[ref.listenersIdx]);
                delete this._hotkeysMap[key];
            }
        }
    }
}
