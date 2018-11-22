import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PipSelectedModule } from 'pip-webui2-behaviors';

import { SelectedExampleComponent } from './selected-example.component';

describe('SelectedExampleComponent', () => {
  let component: SelectedExampleComponent;
  let fixture: ComponentFixture<SelectedExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedExampleComponent],
      imports: [
        CommonModule,
        MatListModule,
        TranslateModule.forRoot(),

        PipSelectedModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
