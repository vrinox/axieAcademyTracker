import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxiesListComponent } from './axies-list.component';

describe('AxiesListComponent', () => {
  let component: AxiesListComponent;
  let fixture: ComponentFixture<AxiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AxiesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
