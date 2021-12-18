import { Component, OnInit, Input } from '@angular/core';
import { AxiesData } from '../models/interfaces';
import { SessionsService } from '../services/sessions/sessions.service';
@Component({
  selector: 'app-axies-list',
  templateUrl: './axies-list.component.html',
  styleUrls: ['./axies-list.component.sass']
})
export class AxiesListComponent implements OnInit {
  openPanel: boolean = false;

  menuView: string = ''
  
  @Input() axie: AxiesData;
  @Input() viewMenu: string = ''

  dark: boolean = false;

  constructor(private sessions: SessionsService) { 
    this.changeDarkMode();
    this.dark = this.sessions.dark;
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
      genes: '',
      parts: [{
        class: '',
        id: '',
        name: '',
        type: ''
      }]
    };
  }

  ngOnInit(): void {
    this.menuView = this.viewMenu;
    this.sessions.getMenuAxieView().subscribe(view=>{
      this.menuView = view;
    })
  }

  changeDarkMode(): void{
    this.sessions.getDarkMode().subscribe(mode=>{
      this.dark = mode;
    });
  }

}
