import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { PipFocusedDirective } from './focused.directive';

@NgModule({
  declarations: [
    PipFocusedDirective
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    PipFocusedDirective
  ],
  providers: [],
})
export class PipFocusedModule { }
