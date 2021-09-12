import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InsertScholarsService } from '../services/insertScholars/insert-scholars.service';
@Component({
  selector: 'app-formulario-becado',
  templateUrl: './formulario-becado.component.html',
  styleUrls: ['./formulario-becado.component.sass']
})
export class FormularioBecadoComponent implements OnInit {
  formBecado: FormGroup = new FormGroup({
    name: new FormControl('',[
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$')
    ]),
    apellido: new FormControl('',[
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$')
    ]),
    roninAddress: new FormControl('',[
      Validators.required
    ]),
    personalAdress: new FormControl('',[
      Validators.required
    ]),
    ganancia: new FormControl('',[
      Validators.required,
      Validators.pattern('^[0-9-% ]+$')
    ])
  })
  constructor(private insertNewScholar: InsertScholarsService) { }

  ngOnInit(): void {
  }

  test(){
    console.log(this.formBecado.value)
    this.insertNewScholar.insertNewScholar(this.formBecado.value);
  }
}
