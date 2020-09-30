import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { PipHotkeysModule } from 'pip-webui2-behaviors';
import { PipThemesModule, pipWebUI2ThemesList } from 'pip-webui2-themes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DraggableExampleModule } from './draggable-example/draggable-example.module';
import { ExamplesListModule } from './examples-list/examples-list.module';
import { FocusedExampleModule } from './focused-example/focused-example.module';
import { HotkeysExampleModule } from './hotkeys-example/hotkeys-example.module';
import { InfiniteScrollExampleModule } from './infinite-scroll-example/infinite-scroll-example.module';
import { InfiniteScrollPageExampleModule } from './infinite-scroll-page-example/infinite-scroll-page-example.module';
import { SelectableExampleModule } from './selectable-example/selectable-example.module';

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

    PipThemesModule.withConfig({
      themes: pipWebUI2ThemesList
    }),
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
