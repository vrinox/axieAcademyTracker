import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SessionsService } from './services/sessions/sessions.service';

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
  loading: boolean = true;

  constructor(public sesion: SessionsService){
    this.sesion.appStart();
  }

  ngOnInit(){
    this.sesion.getLoading().subscribe(viewLoading=>{
      this.loading = viewLoading;
    })
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
