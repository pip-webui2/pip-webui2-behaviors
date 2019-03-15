import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { HotkeysExampleComponent } from './hotkeys-example.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule
    ],
    declarations: [HotkeysExampleComponent]
})
export class HotkeysExampleModule { }
