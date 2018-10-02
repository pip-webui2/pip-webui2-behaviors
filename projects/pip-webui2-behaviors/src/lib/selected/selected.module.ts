import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { PipSelectedComponent } from './selected.component';
import { PipSelectableDirective } from './selectable.directive';

@NgModule({
  declarations: [
    PipSelectedComponent,
    PipSelectableDirective
  ],
  imports: [
    BrowserModule,
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
