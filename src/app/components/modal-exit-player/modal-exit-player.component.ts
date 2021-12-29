import { Component, OnInit } from '@angular/core';
import { SessionsService } from 'src/app/services/sessions/sessions.service';

@Component({
  selector: 'app-modal-exit-player',
  templateUrl: './modal-exit-player.component.html',
  styleUrls: ['./modal-exit-player.component.sass']
})
export class ModalExitPlayerComponent implements OnInit {

  constructor(public sessions: SessionsService) { }

  ngOnInit(): void {
  }

}
