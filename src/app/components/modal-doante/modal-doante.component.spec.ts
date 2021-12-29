import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDoanteComponent } from './modal-doante.component';

describe('ModalDoanteComponent', () => {
  let component: ModalDoanteComponent;
  let fixture: ComponentFixture<ModalDoanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDoanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDoanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
