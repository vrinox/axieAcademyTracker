import { Component, OnInit } from '@angular/core';
import { SessionsService } from './services/sessions/sessions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'axie';
  showFiller = false;
  viewModal: boolean = false;
  loading: boolean = true;

  constructor(private sessions: SessionsService){
  }

  ngOnInit(): void {
    this.sessions.getLoading().subscribe(loadingHome=>{
      this.loading = loadingHome;
    });
  }

  offModal(event: boolean){
    this.viewModal = event
  }
}
