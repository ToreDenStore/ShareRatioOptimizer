/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SurfacePlotComponent } from './surface-plot.component';

describe('SurfacePlotComponent', () => {
  let component: SurfacePlotComponent;
  let fixture: ComponentFixture<SurfacePlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurfacePlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurfacePlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
