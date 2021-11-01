import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StastAxieComponent } from './stast-axie.component';

describe('StastAxieComponent', () => {
  let component: StastAxieComponent;
  let fixture: ComponentFixture<StastAxieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StastAxieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StastAxieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
