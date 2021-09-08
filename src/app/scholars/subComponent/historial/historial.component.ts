import { Component, OnInit, Input } from '@angular/core';
import { Scholar } from '../../../models/scholar';
import { ScholarsComponent } from '../../scholars.component';
import { GetPriceService } from 'src/app/services/getPriceCripto/get-price.service';
import { Slp } from '../../modals/price-usd';

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
  unclaimed: number = 0;
  slpPrice: number = 0;

  constructor(private scholarC: ScholarsComponent,
              private getPrice: GetPriceService) {}

  ngOnInit(): void {
    this.getBestPvp();
    this.calHistorialData();
    this.getPriceSlp();
  }

  getBestPvp(): void{
    this.bestPvp = Math.max(...this.scholarC.scholars.map(element => element.PVPRank));
  }

  calHistorialData(): void{
    this.scholarC.scholars.forEach(scholar=>{
      this.earned += scholar.totalSLP;
      this.claimed += scholar.inRoninSLP;
      this.unclaimed += scholar.inGameSLP;
    });
  }

  async getPriceSlp(){
    let slp: Slp = await this.getPrice.get('smooth-love-potion');
    this.slpPrice = parseInt(slp['smooth-love-potion'].usd.toFixed(2));
  }

}
