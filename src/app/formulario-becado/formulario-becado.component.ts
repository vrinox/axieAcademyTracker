import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Scholar } from '../models/scholar';
import { InsertScholarsService } from '../services/insertScholars/insert-scholars.service';
import { AgregarNewBecadoService } from 'src/app/services/agregarNewBecado/agregar-new-becado.service';
import { StorageService } from '../services/storage/storage.service';

import english from '../../assets/json/lenguaje/englishLanguage.json';
import spanish from '../../assets/json/lenguaje/spanishLanguaje.json';
import { SessionsService } from '../services/sessions/sessions.service';
@Component({
  selector: 'app-formulario-becado',
  templateUrl: './formulario-becado.component.html',
  styleUrls: ['./formulario-becado.component.sass']
})
export class FormularioBecadoComponent implements OnInit {
  @ViewChild('modal', { static: true }) Modal!: ElementRef;
  @Input('ViewModal') viewModal!: boolean;
  @Output() OffModal = new EventEmitter<boolean>();

  exitsRonin: boolean = false;

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

  idiom: any = {};

  constructor(private insertNewScholar: InsertScholarsService,
              private agregarBecado: AgregarNewBecadoService,
              private render: Renderer2,
              private storage: StorageService,
              private sessions: SessionsService) { }
              
  ngOnInit(): void {
    this.changeIdiom();
    this.getLangueaje();
    this.cirreExteriorModal();
  }

  getLangueaje(): void{
    let lenguage: string | null = this.storage.getItem('language');
    if(lenguage === 'es-419' || lenguage === 'es'){
      this.idiom = spanish.register
    }else{
      this.idiom = english.register;
    };
  }

  changeIdiom():void{
    this.sessions.getIdiom().subscribe(change=>{
      if(change){
        this.getLangueaje();
      }
    })
  }
  
  cirreExteriorModal(): void{
    let modal = this.Modal.nativeElement;
    this.render.listen(modal, 'click', (e: Event)=>{
      if(e.target === modal) this.closeModal();
    });
  }

  revisarValido(): void{
    if(this.formBecado.valid){
      this.formBecado.controls.name
      .setValue(`${this.formBecado.controls.name.value} ${this.formBecado.controls.apellido.value}`);
      this.enviarDatos();
      this.closeModal();
    }
  }

  async enviarDatos(): Promise<void>{
    let newScholar: Scholar = await this.insertNewScholar.insertNewScholar({...this.formBecado.value});
    this.sessions.scholar.push(newScholar);
    this.agregarBecado.setNewBecado(newScholar);
  }

  
  closeModal(): void{
    this.OffModal.emit(false);
    this.limpiarFormulario();
  }
  
  limpiarFormulario(): void{
    this.formBecado.reset();
  }

  roninExits(){
    let roninParse: string = this.insertNewScholar.parseRonin(this.formBecado.controls.roninAddress.value);
    this.exitsRonin = this.sessions.scholar.some(scholar => scholar.roninAddress === roninParse);
    if(this.exitsRonin){
      this.formBecado.controls.roninAddress.setErrors({'incorrect': true})
    }else{
      this.formBecado.controls.roninAddress.setErrors(null)
    }
  }
}
