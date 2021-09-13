import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Scholar } from '../models/scholar';
import { InsertScholarsService } from '../services/insertScholars/insert-scholars.service';
import { AgregarNewBecadoService } from './class/agregarNewBecado/agregar-new-becado.service';

@Component({
  selector: 'app-formulario-becado',
  templateUrl: './formulario-becado.component.html',
  styleUrls: ['./formulario-becado.component.sass']
})
export class FormularioBecadoComponent implements OnInit {
  @Input('ViewModal') viewModal!: boolean;
  @Output() OffModal = new EventEmitter<boolean>();

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

  constructor(private insertNewScholar: InsertScholarsService,
              private agregarBecado: AgregarNewBecadoService) { }

  ngOnInit(): void {
  }

  revisarValido(): void{
    if(this.formBecado.valid){
      this.formBecado.controls.name
      .setValue(`${this.formBecado.controls.name.value} ${this.formBecado.controls.apellido.value}`);
      this.enviarDatos();
      this.limpiarFormulario();
    }
  }

  async enviarDatos(): Promise<void>{
    let newScholar = await this.insertNewScholar.insertNewScholar({...this.formBecado.value});
    this.agregarBecado.setNewBecado(new Scholar(newScholar));
  }

  limpiarFormulario(): void{
    this.formBecado.reset();
    Object.keys(this.formBecado.controls).forEach(keys => {
      this.formBecado.get(keys)?.setErrors(null);
    });
  }

  closeModal(): void{
    this.OffModal.emit(false);
    this.limpiarFormulario();
  }

}
