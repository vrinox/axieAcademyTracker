import { Component, OnInit } from '@angular/core';
import { ScholarsComponent } from '../../scholars.component';
import { GetPriceService } from 'src/app/services/getPriceCripto/get-price.service';
import { Historial } from 'src/app/models/interfaces';
import { totals } from 'src/app/models/Totals';
import { SessionsService } from 'src/app/services/sessions/sessions.service';

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

  dark: boolean = false;

  constructor(private scholarC: ScholarsComponent,
              private getPrice: GetPriceService,
              private sessions: SessionsService) {}

  ngOnInit(): void {
    this.dark = this.sessions.dark;
    this.scholarC.changeScholars().subscribe(scholars => {
      this.historial  = [];
      totals.setHistorial(scholars, this.historial, this.slpPrice);
    });
    this.getPriceSlp();
  }


  async getPriceSlp(){
    this.slpPrice = await this.getPrice.get('smooth-love-potion');
  }

}
