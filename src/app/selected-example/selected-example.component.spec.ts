import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedExampleComponent } from './selected-example.component';

describe('SelectedExampleComponent', () => {
  let component: SelectedExampleComponent;
  let fixture: ComponentFixture<SelectedExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedExampleComponent ]
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
