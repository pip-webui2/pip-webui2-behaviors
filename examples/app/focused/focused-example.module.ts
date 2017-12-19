import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatListModule, MatToolbarModule, MatCardModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { FocusedExampleComponent } from './focused-example.component';

import { PipFocusedModule } from '../pip-webui2-behaviors';


@NgModule({
  declarations: [
    FocusedExampleComponent
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
    MatIconModule,

    TranslateModule,

    PipFocusedModule
  ],
  exports: [
    FocusedExampleComponent
  ],
  providers: [
  ],
})
export class FocusedExampleModule { }