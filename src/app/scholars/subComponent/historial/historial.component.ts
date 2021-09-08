import { Component, OnInit } from '@angular/core';
import { ScholarsComponent } from '../../scholars.component';
import { GetPriceService } from 'src/app/services/getPriceCripto/get-price.service';
import { Historial } from 'src/app/models/interfaces';
import { totals } from './models/Totals';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.sass']
})
export class HistorialComponent implements OnInit {
  historial: Historial[] = []

  constructor(private scholarC: ScholarsComponent,
              private getPrice: GetPriceService) {}

  ngOnInit(): void {
    this.getPriceSlp();
  }


  async getPriceSlp(){
    let cryto = await this.getPrice.get('smooth-love-potion');
    let slpPrice: number = parseFloat(cryto['smooth-love-potion'].usd.toFixed(2));
    totals.setHistorial(this.scholarC.scholars, this.historial, slpPrice);
  }

}
