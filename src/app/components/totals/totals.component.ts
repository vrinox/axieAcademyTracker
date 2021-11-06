import { Component, Input, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { Historial } from 'src/app/models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { totals } from 'src/app/models/Totals';
import { GetPriceService } from 'src/app/services/getPriceCripto/get-price.service';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.sass']
})
export class TotalsComponent implements OnInit {
  historial: Historial[] = [];
  imageSrc: string = 'assets/img/SLP.png';
  imageAlt: string = 'SLP';
  trofeoImgSrc: string = 'assets/img/trofeo.jpg';
  trofeoAlt: string = 'copas axie infinity';
  slpPrice: number = 0;
  @Input() scholars: Scholar[] = [];
  constructor(private getPrice: GetPriceService) {
    
  }

  ngOnInit(): void {
    const scholars$ = from(this.scholars);
    scholars$.subscribe((value)=>{
      console.log(value);
    })
    this.historial  = [];
    totals.setHistorial(this.scholars, this.historial, this.slpPrice);
    this.getPriceSlp();
  }


  async getPriceSlp(){
    let cryto = await this.getPrice.get('smooth-love-potion');
    this.slpPrice = parseFloat(cryto['smooth-love-potion'].usd.toFixed(2));
  }

}
