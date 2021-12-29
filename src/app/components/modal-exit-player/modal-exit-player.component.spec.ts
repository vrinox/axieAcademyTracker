import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExitPlayerComponent } from './modal-exit-player.component';

describe('ModalExitPlayerComponent', () => {
  let component: ModalExitPlayerComponent;
  let fixture: ComponentFixture<ModalExitPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalExitPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExitPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
