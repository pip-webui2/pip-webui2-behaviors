import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatListModule, MatToolbarModule, MatCardModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { DraggableExampleComponent } from './draggable-example.component';

import { PipDraggableModule } from '../pip-webui2-behaviors';


@NgModule({
  declarations: [
    DraggableExampleComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatCardModule,
    
    TranslateModule,

    PipDraggableModule
  ],
  exports: [
    DraggableExampleComponent
  ],
  providers: [
  ],
})
export class DraggableExampleModule { }