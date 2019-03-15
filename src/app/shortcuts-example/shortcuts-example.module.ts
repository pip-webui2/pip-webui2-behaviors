import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PipShortcutModule } from 'pip-webui2-behaviors';

import { ShortcutsExampleComponent } from './shortcuts-example.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,

        PipShortcutModule
    ],
    declarations: [ShortcutsExampleComponent]
})
export class ShortcutsExampleModule { }
