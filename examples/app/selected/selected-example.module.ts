import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatListModule, MatToolbarModule } from '@angular/material';

import { SelectedExampleComponent } from './selected-example.component';

import { PipSelectedModule } from '../pip-webui2-behaviors';


@NgModule({
  declarations: [
    SelectedExampleComponent
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

    PipSelectedModule
  ],
  exports: [
    SelectedExampleComponent
  ],
  providers: [
  ],
})
export class SelectedExampleModule { }