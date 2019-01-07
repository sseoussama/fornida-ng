import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRoute4Component } from './no-route4.component';

describe('NoRoute4Component', () => {
  let component: NoRoute4Component;
  let fixture: ComponentFixture<NoRoute4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoRoute4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoRoute4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
