import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AxiesData, MarcketPlaceOficialData, MarketPlacePrice } from 'src/app/models/interfaces'

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  intentos: number = 0;

  constructor(private http: HttpClient) { }

  get(axiesData: AxiesData): Promise<MarketPlacePrice>{
    return new Promise((resolve, reject)=>{
      let test: any = {
        "operationName": "GetAxieBriefList",
        "variables": {
          "from": 0,
          "size": 1,
          "sort": "PriceAsc",
          "auctionType": "Sale",
          "criteria": {
            parts: this.parseParts(axiesData),
            breedCount: [0, 7],
            hp: [axiesData!.hp, axiesData!.hp],
            speed: [axiesData!.speed, axiesData!.speed],
            skill: [axiesData!.skill, axiesData!.skill],
            morale: [axiesData!.morale, axiesData!.morale],
            classes: [axiesData.class],
            pureness: this.calculatePureness(axiesData)
          }
        },
        "query": "query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  id\n  name\n  stage\n  class\n  breedCount\n  image\n  title\n  battleInfo {\n    banned\n    __typename\n  }\n  auction {\n    currentPrice\n    currentPriceUSD\n    __typename\n  }\n  parts {\n    id\n    name\n    class\n    type\n    specialGenes\n    __typename\n  }\n  __typename\n}\n"
      }
      this.http.post('https://graphql-gateway.axieinfinity.com/graphql', test).toPromise().then((res: any) =>{
        let marketplace: MarcketPlaceOficialData = res;
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
        resolve(marketPrice);
      }).catch((error)=>{
        reject(error);
      })
    });
  }

  parseParts(AxiesData: AxiesData): String[]{
    let partsSearch: String[] = [];
    AxiesData.parts.forEach(part=>{
      if(part.type != 'Eyes' && part.type != 'Ears'){
        partsSearch.push(part.type);
        partsSearch.push(part.id);
      }
    });
    return partsSearch
  }

  calculatePureness(AxiesData: AxiesData): number[]{
    let pureness: number[] = [0];
    AxiesData.parts.forEach(part=>{
      if(AxiesData.class === part.class){
        pureness[0] += 1; 
      }
    });
    return pureness
  }
}
