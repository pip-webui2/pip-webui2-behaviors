import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { PipInfiniteScrollDirective } from './infinite-scroll.directive';

@NgModule({
  declarations: [
    PipInfiniteScrollDirective
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    PipInfiniteScrollDirective
  ],
  providers: [],
})
export class PipInfiniteScrollModule { }