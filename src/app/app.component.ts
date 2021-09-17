import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'axie';
  showFiller = false;
  viewModal: boolean = false;

  offModal(event: boolean){
    this.viewModal = event
  }
}
