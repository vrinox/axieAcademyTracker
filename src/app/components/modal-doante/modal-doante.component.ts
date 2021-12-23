import { Component, OnInit } from '@angular/core';
import spanish from '../../../assets/json/lenguaje/spanishLanguaje.json';
import english from '../../../assets/json/lenguaje/englishLanguage.json';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-modal-doante',
  templateUrl: './modal-doante.component.html',
  styleUrls: ['./modal-doante.component.sass']
})
export class ModalDoanteComponent implements OnInit {

  idiom: any = {};

  constructor(private storage: StorageService) { }

  ngOnInit(): void {
    this.getLangueaje();
  }

  getLangueaje(): void{
    let lenguage: string | null = this.storage.getItem('language');
    if(lenguage === 'es-419' || lenguage === 'es'){
      this.idiom = spanish.modalDonate;
    }else{
      this.idiom = english.modalDonate;
    };
  }

}
