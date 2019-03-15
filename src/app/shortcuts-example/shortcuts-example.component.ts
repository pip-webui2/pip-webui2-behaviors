import { Component } from '@angular/core';
import { PipShortcutsService } from 'pip-webui2-behaviors';

@Component({
    selector: 'app-shortcuts-example',
    templateUrl: './shortcuts-example.component.html',
    styleUrls: ['./shortcuts-example.component.scss']
})
export class ShortcutsExampleComponent {

    constructor(
        private pipShortcuts: PipShortcutsService
    ) {
        this.pipShortcuts.globalShortcuts = [
            {
                shortcut: 'ctrl+alt+q',
                action: (event) => {
                    alert('ctrl+alt+q pressed');
                }
            },
            {
                shortcut: 'ctrl+alt+w',
                access: () => false,
                action: (event) => {
                    alert('prevented');
                }
            },
            {
                shortcut: 'ctrl+alt+e',
                navigationCommand: ['focused']
            }
        ];
        this.pipShortcuts.localShortcuts = [
            {
                shortcut: 'shift+alt+q',
                action: (event) => {
                    alert('shift+alt+q pressed');
                }
            },
        ];
    }

    public selectedIndex = 4;

}
