import { ShortcutOptions, KeyboardEventType } from './ShortcutOptions';

export class Shortcut {
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

    private modifiers = {
        shift: { wanted: false, pressed: false },
        ctrl: { wanted: false, pressed: false },
        alt: { wanted: false, pressed: false },
        meta: { wanted: false, pressed: false }	// Meta is Mac specific
    };

    public eventCallback: Function;
    public target: any;
    public event: KeyboardEventType;
    public option: ShortcutOptions;
    public shorcut: string;
    public callback: Function;

    public constructor(
        element: any,
        shorcutCombination: string,
        option: ShortcutOptions,
        callback: (event?: KeyboardEvent) => void
    ) {
        'ngInject';

        this.target = element;
        this.shorcut = shorcutCombination;
        this.event = option.Type;
        this.option = option;
        this.callback = callback;

        this.eventCallback = (event: KeyboardEvent) => {
            const e: KeyboardEvent = event || <KeyboardEvent>window.event;
            let code: number;

            if (this.option.DisableInInput) { // Disable shortcut keys in Input, Textarea fields
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

            const keys: string[] = this.shorcut.split('+');
            // Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
            let kp = 0;

            if (e.ctrlKey) { this.modifiers.ctrl.pressed = e.ctrlKey; }
            if (e.shiftKey) { this.modifiers.shift.pressed = e.shiftKey; }
            if (e.altKey) { this.modifiers.alt.pressed = e.altKey; }
            if (e.metaKey) { this.modifiers.meta.pressed = e.metaKey; }

            let i = 0;
            for (i = 0; i < keys.length; i++) {
                const k: string = keys[i];
                // Modifiers
                if (k === 'ctrl' || k === 'control') {
                    kp++;
                    this.modifiers.ctrl.wanted = true;
                } else if (k === 'shift') {
                    kp++;
                    this.modifiers.shift.wanted = true;
                } else if (k === 'alt') {
                    kp++;
                    this.modifiers.alt.wanted = true;
                } else if (k === 'meta') {
                    kp++;
                    this.modifiers.meta.wanted = true;
                } else if (k.length > 1) { // If it is a special key
                    if (this.special_keys[k] === code) {
                        kp++;
                    }
                } else if (this.option.Keycode) {
                    if (this.option.Keycode === code) { kp++; }
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
                this.modifiers.ctrl.pressed === this.modifiers.ctrl.wanted &&
                this.modifiers.shift.pressed === this.modifiers.shift.wanted &&
                this.modifiers.alt.pressed === this.modifiers.alt.wanted &&
                this.modifiers.meta.pressed === this.modifiers.meta.wanted) {

                this.callback(e);

                if (!this.option.Propagate) { // Stop the event
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
            this.modifiers.ctrl.pressed = false;
            this.modifiers.shift.pressed = false;
            this.modifiers.alt.pressed = false;
            this.modifiers.meta.pressed = false;
        };
    }
}
