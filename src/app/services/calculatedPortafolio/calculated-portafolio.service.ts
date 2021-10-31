import { Injectable } from '@angular/core';
import { AxiesData, MarketPlacePrice, Portafolio } from 'src/app/models/interfaces';
import { MarketplaceService } from '../marketplace/marketplace.service';
import { SessionsService } from '../sessions/sessions.service';

@Injectable({
  providedIn: 'root'
})
export class CalculatedPortafolioService {

  typeAxies: string[] = [];

  total: Portafolio = {
    axies: 0,
    becados: 0,
    eth: 0,
    usd: 0,
    na: 0,
    typeAxies: [0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  constructor(private martketPlace: MarketplaceService,
  private sessions: SessionsService) { }

  async getTotalPortafolio(axiesData: AxiesData[], axiesTypes: string[]): Promise<AxiesData[]>{
      this.cleanPortafolio();
      this.typeAxies = axiesTypes;
  
      await Promise.all(
        axiesData.map(async axieData => {
          return (axieData.class != null) ? this.calculateAxiePrice(axieData) : Promise.resolve(axieData);
        })
      ).then((axiesData: AxiesData[])=>{
        axiesData.forEach((axieData)=>{
          this.calcTotalProtafolio(parseInt(axieData.price || '0'), parseFloat(axieData.eth || '0'));
          this.totalAxiesTypes(axieData.class);
        })
      })

      this.totalBecados();
      this.parseEth();
      return axiesData
    }
  
    private cleanPortafolio(): void{
      this.total.usd = 0;
      this.total.eth = 0;
      this.total.na = 0;
      this.total.axies = 0;  
      this.total.typeAxies = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  private calculateAxiePrice(axieData: AxiesData): Promise<AxiesData>{
    return new Promise(async (resolve)=>{
      try{        
        let marketPrice: MarketPlacePrice = await this.martketPlace.getPrice(axieData);
        axieData.price = marketPrice.price;
        axieData.eth = marketPrice.eth;        
        resolve(axieData);
      }catch(err){
        axieData.price = 'N/A';
        axieData.eth = 'N/A';
        resolve(axieData);
      }
    })
  }

  private calcTotalProtafolio(usd: number, eth: number): void {
    this.total.usd += (isNaN(usd)) ? 0 : usd;
    this.total.eth += (isNaN(eth)) ? 0 : eth;
    this.total.na += (isNaN(usd)) ? 1 : 0;
    this.total.axies += 1;
  }

  private totalBecados(): void {
    this.total.becados = this.sessions.scholar.length;
  }

  private totalAxiesTypes(classAxie: string): void {
    this.typeAxies.forEach((type: string, i: number) => {
      if (type === classAxie) {
        this.total.typeAxies[i - 1] += 1;
      }
    })
  }

  private parseEth(): void {
    let eth: number = parseFloat(this.total.eth.toFixed(3));
    this.total.eth = eth;
  }
}
