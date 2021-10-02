import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxiesComponent } from './axies.component';

describe('AxiesComponent', () => {
  let component: AxiesComponent;
  let fixture: ComponentFixture<AxiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AxiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
