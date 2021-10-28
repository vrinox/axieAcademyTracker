import { Component, OnInit, Input } from '@angular/core';
import { AxiesData } from '../models/interfaces';

@Component({
  selector: 'app-axies-module',
  templateUrl: './axies-module.component.html',
  styleUrls: ['./axies-module.component.sass']
})
export class AxiesModuleComponent implements OnInit {
  @Input() axie: AxiesData;

  constructor() { 
    this.axie = {
      namePlayer: '',
      roning: '',
      image: '',
      class: '',
      id: '',
      name: '',
      hp: 0,
      morale: 0,
      skill: 0,
      speed: 0,
      breedCount: 0,
      parts: [{
        class: '',
        id: '',
        name: '',
        type: ''
      }]
    };
  }

  ngOnInit(): void {

  }

}
