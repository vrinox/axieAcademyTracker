import { Injectable } from '@angular/core';
import { Scholar } from 'src/app/models/scholar';
import { Observable, Subject } from 'rxjs';
import { community, userLink } from 'src/app/models/interfaces';
import { StorageService } from '../storage/storage.service';
import { Router } from '@angular/router';
import { ComunityService } from '../community.service';
@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  infinity: Scholar | null = new Scholar();
  user?: userLink;
  communities: community[] = [];
  init: boolean = false;
  scholar: Scholar[] = [];
  oneScholar: Scholar[] = [];
  private scholar$: Subject<Scholar[]> = new Subject;
  donwloadPdf: Subject<boolean> = new Subject;

  menuAxieView: Subject<string> = new Subject;
  
  communityChange: Subject<community> = new Subject;
  private loadingHome: Subject<boolean> = new Subject;

  clear: Subject<string> = new Subject;


  idiom: Subject<boolean> = new Subject;

  private darkMode: Subject<boolean> = new Subject;
  dark: boolean = false;

  modalScholarName: string = '';

  constructor(
    public storage: StorageService,
    private communityservice: ComunityService,
    private router: Router
  ) {}

  getScholar(): Observable<Scholar[]>{
    return this.scholar$;
  }

  appStart(){
    const cachedSesion = this.getActiveSesionFromLocalStorage();
    if(cachedSesion){
      this.start(cachedSesion.user, cachedSesion.infinity, cachedSesion.communities) 
    } else {
      this.setLoading(false);
      this.router.navigate(['/login'], {replaceUrl:true});
    }
  }

  setScholar(scholars: Scholar[]): void{
    this.scholar = scholars;
    this.scholar$.next(scholars);
  }

  getLoading(): Observable<boolean>{
    return this.loadingHome
  }

  setLoading(onOffLoading: boolean): void{
    this.loadingHome.next(onOffLoading);
  }

  start(user: userLink, scholar: Scholar, communities: community[]):void{
    this.user = user;
    this.infinity = scholar;
    this.communities = communities;
    this.communityservice.activeCommunity = communities[0];
    this.communityChange.next(communities[0]);
    this.setSesionToLocalStorage();
    this.init = true;
    this.router.navigate(['/scholars'], {replaceUrl:true});
  }
  setSesionToLocalStorage():void{
    this.storage.setItem('user',JSON.stringify(this.user!));
    this.storage.setItem('scholar',JSON.stringify(this.infinity));
    this.storage.setItem('communities',JSON.stringify(this.communities));
  }
  getActiveSesionFromLocalStorage(){
    const user = this.storage.getItem('user');
    const scholar = this.storage.getItem('scholar');
    const commnunities = this.storage.getItem('communities');
    if(user !== null && scholar !== null && commnunities !== null){
      return {
        user: JSON.parse(user),
        infinity: JSON.parse(scholar),
        communities: JSON.parse(commnunities)
      }
    }else{
      return false;
    }
  }
  
  close(){
    this.init = false;
    this.storage.clear();
    this.infinity = new Scholar();
    this.user = undefined;
    this.communities = [];
    this.router.navigate(['/login'], {replaceUrl:true});
  }

  getDonwloadPdf(): Observable<boolean>{
    return this.donwloadPdf
  }

  setDonwloadPdf(value: boolean){
    this.donwloadPdf.next(value);
  }

  getMenuAxieView(): Observable<string>{
    return this.menuAxieView;
  }

  setMenuAxieView(viewAxie :string){
    this.menuAxieView.next(viewAxie);
  }

  getClear(): Observable<string>{
    return this.clear
  }
  
  setClear(value: string): void{
    this.clear.next(value);
  }

  getIdiom(): Observable<boolean>{
    return this.idiom;
  }

  setIdiom(value: boolean): void{
    this.idiom.next(value);
  }

  getDarkMode(): Observable<boolean>{
    return this.darkMode;
  }

  setDarkMode(dark: boolean): void{
    this.dark = dark;
    this.darkMode.next(dark);
  }
}
