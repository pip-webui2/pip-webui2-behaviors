import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusedExampleComponent } from './focused-example.component';

describe('FocusedExampleComponent', () => {
  let component: FocusedExampleComponent;
  let fixture: ComponentFixture<FocusedExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FocusedExampleComponent ]
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
