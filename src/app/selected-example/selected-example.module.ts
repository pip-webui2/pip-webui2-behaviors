import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipSelectedModule } from 'pip-webui2-behaviors';

import { SelectedExampleComponent } from './selected-example.component';

@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    TranslateModule,

    PipSelectedModule
  ],
  declarations: [SelectedExampleComponent]
})
export class SelectedExampleModule { }
