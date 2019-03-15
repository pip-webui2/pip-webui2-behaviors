import { NgModule, ModuleWithProviders } from '@angular/core';

import { PipHotkeysService } from './shared/hotkeys.service';

@NgModule({
    declarations: [],
})
export class PipHotkeysModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PipHotkeysModule,
            providers: [
                PipHotkeysService
            ]
        };
    }
}
