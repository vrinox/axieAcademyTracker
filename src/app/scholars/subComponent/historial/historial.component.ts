import { Component, OnInit, Input } from '@angular/core';
import { Scholar } from '../../../models/scholar';
import { ScholarsComponent } from '../../scholars.component';
@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.sass']
})
export class HistorialComponent implements OnInit {
  bestPvp: number = 0;

  constructor(private scholarC: ScholarsComponent) {}

  ngOnInit(): void {
    this.getBestPvp();
  }

  getBestPvp(): void{
    console.log(this.scholarC.scholars)
    console.log(this.bestPvp)
    this.bestPvp = Math.max(...this.scholarC.scholars.map(element => element.PVPRank));
    console.log(this.bestPvp)
  }



}
