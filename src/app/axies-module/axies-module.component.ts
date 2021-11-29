import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AxiesData, MarketPlacePrice } from '../models/interfaces';
import { MarketplaceService } from 'src/app/services/marketplace/marketplace.service'
import { SessionsService } from '../services/sessions/sessions.service';
import { AxieGene } from 'agp-npm/dist/axie-gene';

@Component({
  selector: 'app-axies-module',
  templateUrl: './axies-module.component.html',
  styleUrls: ['./axies-module.component.sass']
})
export class AxiesModuleComponent implements OnInit {
  @Input() axie: AxiesData;
  @Input() viewMenu: string = ''
  @Output() refresh = new EventEmitter();

  await: boolean = false;
  purity: number = 0;
  menuView: string = ''
  axieGenes: any = ''

  constructor(private market: MarketplaceService, private sessions: SessionsService) { 
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
    this.menuView = this.viewMenu;
    this.sessions.getMenuAxieView().subscribe(view=>{
      this.menuView = view;
    })
    this.setPurress();
  }


  async refreshNA(): Promise<void>{
    if(!this.await){
      this.await = true;
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

  setPurress(){
    this.axieGenes = new AxieGene(this.axie.genes);
    this.purity = this.axieGenes.getGeneQuality();
  }

}
