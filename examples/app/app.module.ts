import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule, MatSelectModule, MatSidenavModule, MatIconModule,MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { PipThemesModule } from 'pip-webui2-themes';

import { AppComponent } from './app.component';
import { ExampleListModule } from './examples-list/examples-list.module';

import { SelectedExampleModule } from './selected/selected-example.module';
import { SelectedExampleComponent } from './selected/selected-example.component';

import { FocusedExampleModule } from './focused/focused-example.module';
import { FocusedExampleComponent } from './focused/focused-example.component';

import { InfiniteScrollExampleModule } from './infinite-scroll/infinite-scroll-example.module';
import { InfiniteScrollExampleComponent } from './infinite-scroll/infinite-scroll-example.component';

import { DraggableExampleModule } from './draggable/draggable-example.module';
import { DraggableExampleComponent } from './draggable/draggable-example.component';

const appRoutes: Routes = [
  { path: 'selected', component: SelectedExampleComponent },
  { path: 'focused', component: FocusedExampleComponent },
  { path: 'infinite_scroll', component: InfiniteScrollExampleComponent },
  { path: 'draggable', component: DraggableExampleComponent },
  { path: '', pathMatch: 'full', redirectTo: 'selected' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatSelectModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    PipThemesModule,

    ExampleListModule,
    SelectedExampleModule,
    FocusedExampleModule,
    InfiniteScrollExampleModule,
    DraggableExampleModule,

    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
 