import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxiesModuleComponent } from './axies-module.component';

describe('AxiesModuleComponent', () => {
  let component: AxiesModuleComponent;
  let fixture: ComponentFixture<AxiesModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AxiesModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxiesModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
