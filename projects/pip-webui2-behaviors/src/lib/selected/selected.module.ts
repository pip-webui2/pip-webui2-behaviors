import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PipSelectableDirective } from './selectable.directive';
import { PipSelectedComponent } from './selected.component';

/**
 * @deprecated Deprecated since 1.1.16
 */
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
