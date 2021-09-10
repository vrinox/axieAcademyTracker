import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-becado',
  templateUrl: './formulario-becado.component.html',
  styleUrls: ['./formulario-becado.component.sass']
})
export class FormularioBecadoComponent implements OnInit {
  formBecado: FormGroup = new FormGroup({
    nombre: new FormControl('',[
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$')
    ]),
    apellido: new FormControl('',[
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$')
    ]),
    roningAdress: new FormControl('',[
      Validators.required
    ]),
    roningPersonal: new FormControl('',[
      Validators.required
    ]),
    ganancia: new FormControl('',[
      Validators.required,
      Validators.pattern('^[0-9-% ]+$')
    ])
  })
  constructor() { }

  ngOnInit(): void {
  }

  test(){
    console.log(this.formBecado.controls.nombre.valid)
  }
}
