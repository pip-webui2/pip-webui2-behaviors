import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { PipSelectedComponent } from './selected.component';
import { PipSelectableDirective } from './selectable.directive';

@NgModule({
  declarations: [
    PipSelectedComponent,
    PipSelectableDirective
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    PipSelectedComponent,
    PipSelectableDirective
  ],
  providers: [],
})
export class PipSelectedModule { }
