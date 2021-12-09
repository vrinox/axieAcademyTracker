import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAutoCompletComponent } from './input-auto-complet.component';

describe('InputAutoCompletComponent', () => {
  let component: InputAutoCompletComponent;
  let fixture: ComponentFixture<InputAutoCompletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputAutoCompletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputAutoCompletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
