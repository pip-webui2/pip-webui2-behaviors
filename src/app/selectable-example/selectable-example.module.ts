import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipSelectableModule } from 'pip-webui2-behaviors';

import { SelectableExampleComponent } from './selectable-example.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatCheckboxModule,
        TranslateModule.forChild(),

        PipSelectableModule
    ],
    declarations: [SelectableExampleComponent]
})
export class SelectableExampleModule { }
