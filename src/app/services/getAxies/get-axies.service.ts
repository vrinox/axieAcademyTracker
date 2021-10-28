import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AxiesParseData, AxiesOficialData, AxiesData, AxiesResultsOficialData } from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GetAxiesService {

  private api_url: string = 'https://api.lunaciaproxy.cloud/';

  constructor(private http: HttpClient) { }

  get(roningAdress: string, nameUser: string): Promise<AxiesData[]>{
    return new Promise((resolve, reject)=>{
      let test: any = {
        "operationName": "GetAxieLatest",
        "variables": {
          "from": 0,
          "size": 24,
          "sort": "PriceAsc",
          "auctionType": "All",
          "owner": roningAdress
        },
        "query": "query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  level\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n"
      }
      this.http.post('https://graphql-gateway.axieinfinity.com/graphql', test)
      .subscribe((res: any)=>{
        let axiesData: AxiesData[] = [];
        let axieDataOficial: AxiesOficialData = res;
        if(axieDataOficial.data != null){
          axieDataOficial.data.axies.results.forEach((Result: AxiesResultsOficialData)=>{
            let axiesParse: AxiesParseData = this.parseAxies(Result, roningAdress, nameUser);
            axiesData.push(axiesParse);
          })
        }
        resolve(axiesData);
      }, (error)=>{
        reject();
      });

    });
  }

  private parseAxies(axiesParse: AxiesResultsOficialData, roningAdress: string, nameUser: string): AxiesParseData{
    let axiesData: AxiesParseData = {
      roning: roningAdress,
      namePlayer: nameUser,
      name: axiesParse.name,
      image: axiesParse.image,
      breedCount: axiesParse.breedCount,
      id: axiesParse.id,
      class: axiesParse.class,
      hp: axiesParse.stats.hp,
      morale: axiesParse.stats.morale,
      speed: axiesParse.stats.speed,
      skill: axiesParse.stats.skill,
      parts: axiesParse.parts
    }
    
    return axiesData
  }
}
