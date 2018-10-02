import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule, BREAKPOINTS, DEFAULT_BREAKPOINTS } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipThemesModule } from 'pip-webui2-themes-temp';

import { AppRoutingModule } from './app-routing.module';
import { DraggableExampleModule } from './draggable-example/draggable-example.module';
import { ExamplesListModule } from './examples-list/examples-list.module';
import { FocusedExampleModule } from './focused-example/focused-example.module';
import { InfiniteScrollExampleModule } from './infinite-scroll-example/infinite-scroll-example.module';
import { SelectedExampleModule } from './selected-example/selected-example.module';

import { AppComponent } from './app.component';

export const CustomBreakPointsProvider = {
  provide: BREAKPOINTS,
  useValue: [...DEFAULT_BREAKPOINTS]
};

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

    PipThemesModule,

    AppRoutingModule,
    ExamplesListModule,
    SelectedExampleModule,
    FocusedExampleModule,
    InfiniteScrollExampleModule,
    DraggableExampleModule,
  ],
  providers: [CustomBreakPointsProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
