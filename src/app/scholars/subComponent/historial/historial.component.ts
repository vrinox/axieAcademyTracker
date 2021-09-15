import { Component, OnInit } from '@angular/core';
import { ScholarsComponent } from '../../scholars.component';
import { GetPriceService } from 'src/app/services/getPriceCripto/get-price.service';
import { Historial } from 'src/app/models/interfaces';
import { totals } from 'src/app/models/Totals';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.sass']
})
export class HistorialComponent implements OnInit {
  historial: Historial[] = [];
  imageSrc: string = 'assets/img/SLP.png';
  imageAlt: string = 'SLP';
  trofeoImgSrc: string = 'assets/img/trofeo.jpg';
  trofeoAlt: string = 'copas axie infinity';
  slpPrice: number = 0;

  constructor(private scholarC: ScholarsComponent,
              private getPrice: GetPriceService) {}

  ngOnInit(): void {
    this.scholarC.changeScholars().subscribe(scholars => {
      this.historial  = [];
      totals.setHistorial(scholars, this.historial, this.slpPrice);
    });
    this.getPriceSlp();
  }


  async getPriceSlp(){
    let cryto = await this.getPrice.get('smooth-love-potion');
    this.slpPrice = parseFloat(cryto['smooth-love-potion'].usd.toFixed(2));
  }

}
