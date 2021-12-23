import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SessionsService } from './services/sessions/sessions.service';
import { StorageService } from './services/storage/storage.service';
import english from '../assets/json/lenguaje/englishLanguage.json';
import spanish from '../assets/json/lenguaje/spanishLanguaje.json';
import { MatDialog } from '@angular/material/dialog';
import { ModalDoanteComponent } from './components/modal-doante/modal-doante.component';
import { GetPriceService } from '../app/services/getPriceCripto/get-price.service';
import { CommunityPerfilComponent } from './community-perfil/community-perfil.component';
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

  slp: number = 0;
  eth: number = 0;

  constructor(
    public sesion: SessionsService,
    private storage: StorageService,
    public dialog: MatDialog,
    private cryto: GetPriceService
    ){}

  ngOnInit(){
    this.darkStorage();
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
    this.getCryto();
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

  darkStorage(): void{
    let darkStore = this.storage.getItem('darkMode');
    if(darkStore === 'true'){
      this.sesion.setDarkMode(true);
      this.dark = true;
    }
  }

  setDarkMode(): void{
    this.sesion.setDarkMode(!this.DarkMode.checked);
    this.storage.setItem('darkMode', `${!this.DarkMode.checked}`);
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

  doanteModal(): void{
    const dialogRef = this.dialog.open(ModalDoanteComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  communityModal(): void{
    const dialogRef = this.dialog.open(CommunityPerfilComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  async getCryto(): Promise<void>{
    this.slp = await this.cryto.get('smooth-love-potion');
    this.eth = await this.cryto.get('ethereum');
  }
}
