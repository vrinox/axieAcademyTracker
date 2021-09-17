import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioBecadoComponent } from './formulario-becado.component';

describe('FormularioBecadoComponent', () => {
  let component: FormularioBecadoComponent;
  let fixture: ComponentFixture<FormularioBecadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioBecadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioBecadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
