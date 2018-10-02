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
    PipDragPreventDirective
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
    PipDragPreventDirective
  ],
  providers: [
    PipDraggableService
  ]
})
export class PipDraggableModule { }
