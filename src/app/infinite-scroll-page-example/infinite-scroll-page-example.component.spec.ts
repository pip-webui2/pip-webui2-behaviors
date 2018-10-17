import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollPageExampleComponent } from './infinite-scroll-page-example.component';

describe('InfiniteScrollPageExampleComponent', () => {
  let component: InfiniteScrollPageExampleComponent;
  let fixture: ComponentFixture<InfiniteScrollPageExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfiniteScrollPageExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfiniteScrollPageExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
