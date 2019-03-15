import { NgModule, ModuleWithProviders } from '@angular/core';

import { PipShortcutsService as PipShortcutsService } from './shared/shortcut.service';
import { PipShortcutsBindingService, shortcutsDefaultProvider } from './shared/shortcut.binding.service';

@NgModule({
    declarations: [],
})
export class PipShortcutsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PipShortcutsModule,
            providers: [
                PipShortcutsBindingService,
                PipShortcutsService,
                shortcutsDefaultProvider
            ]
        };
    }
}
