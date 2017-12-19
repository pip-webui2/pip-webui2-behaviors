import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatListModule, MatToolbarModule, MatCardModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollExampleComponent } from './infinite-scroll-example.component';

import { PipInfiniteScrollModule } from '../pip-webui2-behaviors';


@NgModule({
  declarations: [
    InfiniteScrollExampleComponent
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

    PipInfiniteScrollModule
  ],
  exports: [
    InfiniteScrollExampleComponent
  ],
  providers: [
  ],
})
export class InfiniteScrollExampleModule { }