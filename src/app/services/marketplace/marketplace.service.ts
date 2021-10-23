import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AxiesData } from 'src/app/models/interfaces'

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  get(axiesData: AxiesData): Promise<boolean>{
    return new Promise((resolve)=>{
      let test: any = {
        "operationName": "GetAxieBriefList",
        "variables": {
          "from": 0,
          "size": 24,
          "sort": "PriceAsc",
          "auctionType": "Sale",
          "criteria": {
            parts: this.parseParts(axiesData),
            breedCount: [0, 7],
            hp: [axiesData.stats.hp, axiesData.stats.hp],
            speed: [axiesData.stats.speed, axiesData.stats.speed],
            skill: [axiesData.stats.skill, axiesData.stats.skill],
            morale: [axiesData.stats.morale, axiesData.stats.morale],
            classes: [axiesData.axie.class]
          }
        },
        "query": "query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  id\n  name\n  stage\n  class\n  breedCount\n  image\n  title\n  battleInfo {\n    banned\n    __typename\n  }\n  auction {\n    currentPrice\n    currentPriceUSD\n    __typename\n  }\n  parts {\n    id\n    name\n    class\n    type\n    specialGenes\n    __typename\n  }\n  __typename\n}\n"
      }
      // this.http.post('https://graphql-gateway.axieinfinity.com/graphql', test).subscribe(res=>{
      //   console.log(res);
      // })
      console.log(test);
      resolve(true)
    });
  }

  parseParts(AxiesData: AxiesData): String[]{
    let partsSearch: String[] = [];
    AxiesData.parts.forEach(part=>{
      partsSearch.push(part.type);
      partsSearch.push(part.id);
    });
    return partsSearch
  }
}
