import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule, MatToolbarModule, MatCardModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipFocusedModule } from 'pip-webui2-behaviors';

import { FocusedExampleComponent } from './focused-example.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatListModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    TranslateModule,

    PipFocusedModule
  ],
  declarations: [FocusedExampleComponent]
})
export class FocusedExampleModule { }
