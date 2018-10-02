import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { PipInfiniteScrollDirective } from './infinite-scroll.directive';

@NgModule({
  declarations: [
    PipInfiniteScrollDirective
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    PipInfiniteScrollDirective
  ],
  providers: [],
})
export class PipInfiniteScrollModule { }
