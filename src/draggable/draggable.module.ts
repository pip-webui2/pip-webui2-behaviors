import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { PipDraggableService } from './shared/draggable.service';
import { PipDragDirective } from './drag.directive';
import { PipDropDirective } from './drop.directive';
import { PipDragCancelDirective } from './drag-cancel.diretive';
import { PipDragPreventDirective } from './drag-prevent.directive';

@NgModule({
  declarations: [
    PipDragDirective,
    PipDropDirective,
    PipDragCancelDirective,
    PipDragCancelDirective
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    PipDragDirective,
    PipDropDirective,
    PipDragCancelDirective,
    PipDragCancelDirective
  ],
  providers: [
    PipDraggableService
  ]
})
export class PipDraggableModule { }