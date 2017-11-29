import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { PipFocusedDirective } from './focused.directive';

@NgModule({
  declarations: [
    PipFocusedDirective
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    PipFocusedDirective
  ],
  providers: [],
})
export class PipFocusedModule { }