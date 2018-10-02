import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableExampleComponent } from './draggable-example.component';

describe('DraggableExampleComponent', () => {
  let component: DraggableExampleComponent;
  let fixture: ComponentFixture<DraggableExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraggableExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraggableExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
