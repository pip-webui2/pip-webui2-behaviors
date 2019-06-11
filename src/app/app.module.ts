import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipHotkeysModule } from 'pip-webui2-behaviors';
import { PipThemesModule } from 'pip-webui2-themes';

import { AppRoutingModule } from './app-routing.module';
import { DraggableExampleModule } from './draggable-example/draggable-example.module';
import { ExamplesListModule } from './examples-list/examples-list.module';
import { FocusedExampleModule } from './focused-example/focused-example.module';
import { InfiniteScrollExampleModule } from './infinite-scroll-example/infinite-scroll-example.module';
import { InfiniteScrollPageExampleModule } from './infinite-scroll-page-example/infinite-scroll-page-example.module';
import { SelectableExampleModule } from './selectable-example/selectable-example.module';
import { HotkeysExampleModule } from './hotkeys-example/hotkeys-example.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,

    TranslateModule.forRoot(),

    PipThemesModule.forRoot(),
    PipHotkeysModule,

    AppRoutingModule,
    ExamplesListModule,
    SelectableExampleModule,
    FocusedExampleModule,
    InfiniteScrollExampleModule,
    InfiniteScrollPageExampleModule,
    HotkeysExampleModule,
    DraggableExampleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
