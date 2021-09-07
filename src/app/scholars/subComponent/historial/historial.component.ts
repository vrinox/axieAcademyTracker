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
  nameBestPvp: String = '';
  earned: number = 0;
  claimed: number = 0;

  constructor(private scholarC: ScholarsComponent) {}

  ngOnInit(): void {
    this.getBestPvp();
    this.calHistorialData();
  }

  getBestPvp(): void{
    console.log(this.scholarC.scholars);
    this.bestPvp = Math.max(...this.scholarC.scholars.map(element => element.PVPRank));
  }

  calHistorialData(): void{
    this.scholarC.scholars.forEach(scholar=>{
      this.earned += scholar.totalSLP;
      this.claimed += scholar.inRoninSLP;
    });
  }

}
