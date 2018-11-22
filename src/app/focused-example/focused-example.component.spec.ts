import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule, MatToolbarModule, MatCardModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipFocusedModule } from 'pip-webui2-behaviors';

import { FocusedExampleComponent } from './focused-example.component';

describe('FocusedExampleComponent', () => {
  let component: FocusedExampleComponent;
  let fixture: ComponentFixture<FocusedExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FocusedExampleComponent],
      imports: [
        CommonModule,
        FlexLayoutModule,
        MatListModule,
        MatToolbarModule,
        MatCardModule,
        MatIconModule,
        TranslateModule.forRoot(),

        PipFocusedModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusedExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
