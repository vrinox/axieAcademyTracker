import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AxiesData, MarketPlacePrice } from '../models/interfaces';
import { MarketplaceService } from 'src/app/services/marketplace/marketplace.service'

@Component({
  selector: 'app-axies-module',
  templateUrl: './axies-module.component.html',
  styleUrls: ['./axies-module.component.sass']
})
export class AxiesModuleComponent implements OnInit {
  @Input() axie: AxiesData;
  @Output() refresh = new EventEmitter();

  await: boolean = false;

  constructor(private market: MarketplaceService) { 
    this.axie = {
      namePlayer: '',
      roning: '',
      image: '',
      class: '',
      id: '',
      name: '',
      hp: 0,
      morale: 0,
      skill: 0,
      speed: 0,
      breedCount: 0,
      genes: '',
      parts: [{
        class: '',
        id: '',
        name: '',
        type: ''
      }]
    };
  }

  ngOnInit(): void {
  }


  async refreshNA(): Promise<void>{
    if(!this.await){
      this.await = true;
      console.log('hola')
      let marketPrice: MarketPlacePrice = await this.market.getPrice(this.axie)
      if(marketPrice.price != 'N/A'){
        this.axie.eth = marketPrice.eth;
        this.axie.price = marketPrice.price;
        this.refresh.emit(true);
      }else{
        this.await = false;
      }
    }
  }

}
