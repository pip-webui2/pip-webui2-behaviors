import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';

import { ShortcutsConfig } from './ShortcutsConfig';
import { ShortcutItem } from './ShortcutItem';
import { ShortcutOptions, KeyboardEventType } from './ShortcutOptions';
import { PipShortcutsBindingService } from './shortcut.binding.service';

@Injectable()
export class PipShortcutsService {

    private _config: ShortcutsConfig;
    private _oldConfig: ShortcutsConfig;
    private _defaultOptions: ShortcutOptions = {
        Type: KeyboardEventType.Keydown,
        Propagate: false,
        DisableInInput: false,
        Target: document,
        Keycode: null
    };

    constructor(
        private pipShortcutBinding: PipShortcutsBindingService,
        private router: Router
    ) {
        this._config = new ShortcutsConfig();
        this._oldConfig = cloneDeep(this._config);
    }

    // public hasShortcut(shortcut: string | string[]) {
    //     const lookingFor = Array.isArray(shortcut) ? shortcut : [shortcut];
    //     for (const arr of [this._config.globalShortcuts, this._config.localShortcuts]) {
    //         for (const sh of arr) {
    //             const found = !Array.isArray(sh.shortcut) && lookingFor.includes(sh.shortcut);
    //             /// || (<string[]>sh.shortcut).filter(s => lookingFor.includes(s)).length > 0;
    //             if (found) { return true; }
    //         }
    //     }
    //     return false;
    // }

    // public addGlobal(item: ShortcutItem): boolean {
    //     if (this.hasShortcut(item.shortcut)) { return false; }
    //     item.options = item.options ? Object.assign(item.options, cloneDeep(this._defaultOptions)) : cloneDeep(this._defaultOptions);
    //     this._config.globalShortcuts.push(item);
    //     const shortcutCombination: string = item.shortcut.toLowerCase();
    //     let element = item.options.Target;

    //     if (typeof element === 'string') {
    //         element = document.getElementById(element);
    //     }

    //     if (!element || !shortcutCombination) { return; }

    //     const shortcut = new Shortcut(element, item.shortcut, item.options, item.action);
    //     if (document.addEventListener) {
    //         document.addEventListener(item.options.Type, () => { shortcut.eventCallback(); }, false);
    //     } else if (element.attachEvent) {
    //         element.attachEvent('on' + item.options.Type, shortcut.eventCallback);
    //     } else {
    //         element.on(item.options.Type, shortcut.eventCallback);
    //     }
    // }

    // Describe private functions
    private sendChangeEvent() {
        // Remove shortcuts
        this.removeShortcuts(this._oldConfig.globalShortcuts);
        this.removeShortcuts(this._oldConfig.localShortcuts);

        // Add shortcuts
        this.addShortcuts(this.config.globalShortcuts);
        this.addShortcuts(this.config.localShortcuts);

        // Save current config to oldConfig
        this._oldConfig = cloneDeep(this.config);
    }

    private removeShortcuts(collection: ShortcutItem[]): void {
        for (const k of collection) {
            this.pipShortcutBinding.remove(k.shortcut);
        }
    }

    private keypressShortcut(item: ShortcutItem, event: KeyboardEvent) {
        if (item.access && typeof item.access === 'function') {
            if (!item.access(event)) {
                return;
            }
        }

        if (item.action) {
            item.action(event);
            return;
        }

        if (item.href) {
            window.location.href = item.href;
            return;
        }

        if (item.navigationCommand) {
            this.router.navigate(
                Array.isArray(item.navigationCommand) ? item.navigationCommand : [item.navigationCommand],
                item.navigationExtras
            );
            return;
        }
    }

    private addShortcuts(collection: ShortcutItem[]): void {
        const generalOptions: ShortcutOptions = this.config.defaultOptions ? this.config.defaultOptions : <ShortcutOptions>{};

        for (const k of collection) {
            const option: ShortcutOptions = k.options ? k.options : generalOptions;
            let target: any;

            target = k.target ? k.target : k.targetId;
            if (target) {
                option.Target = target;
            }
            // Registration of keyboard shortcut
            this.pipShortcutBinding.add(k.shortcut, (e?: any) => {
                this.keypressShortcut(k, e);
            }, option);
        }
    }

    // Describe public functions
    public get config(): ShortcutsConfig {
        return this._config;
    }

    public get defaultOptions(): ShortcutOptions {
        return this._config.defaultOptions;
    }

    public set defaultOptions(value: ShortcutOptions) {
        this._config.defaultOptions = value || null;
        this.sendChangeEvent();
    }

    public get globalShortcuts(): ShortcutItem[] {
        return this._config.globalShortcuts;
    }

    public set globalShortcuts(value: ShortcutItem[]) {
        this._config.globalShortcuts = value || [];
        this.sendChangeEvent();
    }

    public get localShortcuts(): ShortcutItem[] {
        return this._config.localShortcuts;
    }

    public set localShortcuts(value: ShortcutItem[]) {
        this._config.localShortcuts = value || [];
        this.sendChangeEvent();
    }
}
