import { Component, Injector, SkipSelf } from '@angular/core';
import { PipHotkeysService } from 'pip-webui2-behaviors';

import { HotkeysExampleModule } from './hotkeys-example.module';

@Component({
    selector: 'app-hotkeys-example',
    templateUrl: './hotkeys-example.component.html',
    styleUrls: ['./hotkeys-example.component.scss'],
    providers: [PipHotkeysService]
})
export class HotkeysExampleComponent {

    constructor(
        private pipHotkeys: PipHotkeysService,
        @SkipSelf() private injector: Injector
    ) {
        this.pipHotkeys.add({
            hotkey: 'alt+ h',
            action: () => { alert('alt+h pressed'); }
        });
        this.pipHotkeys.add({
            hotkey: 'alt+h',
            action: () => { alert('shouldnt exist'); }
        });
        this.pipHotkeys.add({
            hotkey: 'alt+.',
            action: () => { alert('Local alt+.'); }
          });
        const globalPipHotkeys: PipHotkeysService = this.injector.get(PipHotkeysService);
        globalPipHotkeys.remove('alt+g');
        globalPipHotkeys.add({
            hotkey: 'alt+g',
            action: () => { alert('New global alt+g'); }
        });
    }

    public selectedIndex = 4;

}
