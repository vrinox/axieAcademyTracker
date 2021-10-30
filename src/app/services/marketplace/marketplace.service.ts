import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AxiesData, MarcketPlaceOficialData, MarketPlacePrice } from 'src/app/models/interfaces'
import { graphqlBodyAxie } from 'src/app/models/graphqlBodyAxie';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  private API_AXIE: string = 'https://graphql-gateway.axieinfinity.com/graphql';

  constructor(private http: HttpClient) { }

  getPrice(axiesData: AxiesData): Promise<MarketPlacePrice>{
    return new Promise((resolve, reject)=>{
      this.http.post(this.API_AXIE, graphqlBodyAxie.getBodyPrice(axiesData)).toPromise().then((res: any) =>{
      
        resolve(this.setPrice(res));

      }).catch((error)=>{

        reject(error);
      })
    });
  }

  setPrice(marketplace: MarcketPlaceOficialData): MarketPlacePrice{
    let marketPrice: MarketPlacePrice;
    if(marketplace.data != null && marketplace.data.axies.results.length > 0){
      marketPrice = {
        eth: (parseFloat(marketplace.data.axies.results[0].auction.currentPrice)/(10 ** 18)).toFixed(3),
        price: marketplace.data.axies.results[0].auction.currentPriceUSD
      };
    }else{
      marketPrice = {
        eth: 'N/A',
        price: 'N/A'
      }
    }
    return marketPrice
  }
}
