import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SessionsService } from './services/sessions/sessions.service';
import { StorageService } from './services/storage/storage.service';
import english from '../assets/json/lenguaje/englishLanguage.json';
import spanish from '../assets/json/lenguaje/spanishLanguaje.json';
import { MatSlideToggleDefaultOptions } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('darkMode') DarkMode!: any;
  title = 'axie';
  showFiller = false;
  viewModal: boolean = false;
  loading: boolean = false;
  communityName: string = "";
  browserIdiom: string = ''
  idiom: any = {};

  dark: boolean = false;

  constructor(public sesion: SessionsService, private storage: StorageService){}

  ngOnInit(){
    this.getLengueaje();
    this.sesion.getLoading().subscribe(viewLoading=>{
      this.loading = viewLoading;
    })
    this.sesion.appStart();
    this.communityName = this.storage.getItem('community')!;
    this.sesion.communityChange.subscribe((community)=>{
      if(community){
        this.communityName = community.name;
      }
    });
  }

  getLengueaje(): void{
    let language: any = this.storage.getItem('language');
    this.browserIdiom = language;
    if(language != null){
      this.setLenagueaje(language);
    }else{
      this.setLenagueaje(window.navigator.language); 
    };
  }

  changeLanguage(language: string): void{
    this.storage.setItem('language', language);
    this.browserIdiom = language;
    this.sesion.setIdiom(true);
    this.getLengueaje();
  }

  setLenagueaje(lenguage: string): void{
    this.storage.setItem('language', lenguage);
    if(lenguage === 'es-419' || lenguage === 'es'){
      this.idiom = spanish.appComponent;
    }else{
      this.idiom = english.appComponent;
    };
  }

  setDarkMode(): void{
    this.dark = !this.DarkMode.checked;
    this.sesion.setDarkMode(!this.DarkMode.checked);
  }

  offModal(event: boolean){
    this.viewModal = event
  }

  close(){
    this.sidenav.toggle();
  }

  logOut(){
    this.sesion.close();
    this.sidenav.toggle();
  }
}
