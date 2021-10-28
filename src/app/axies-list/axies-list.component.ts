import { Component, OnInit, Input } from '@angular/core';
import { AxiesData } from '../models/interfaces';

@Component({
  selector: 'app-axies-list',
  templateUrl: './axies-list.component.html',
  styleUrls: ['./axies-list.component.sass']
})
export class AxiesListComponent implements OnInit {
  openPanel: boolean = false;
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
