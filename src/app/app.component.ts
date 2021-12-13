import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SessionsService } from './services/sessions/sessions.service';
import { StorageService } from './services/storage/storage.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'axie';
  showFiller = false;
  viewModal: boolean = false;
  loading: boolean = false;
  communityName: string = "";
  constructor(public sesion: SessionsService, private storage: StorageService){}

  ngOnInit(){
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
