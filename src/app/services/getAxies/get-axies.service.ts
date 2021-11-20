import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AxiesOficialData, AxiesData, AxiesResultsOficialData } from 'src/app/models/interfaces';
import { graphqlBodyAxie } from 'src/app/models/graphqlBodyAxie';
import { Scholar } from 'src/app/models/scholar';

@Injectable({
  providedIn: 'root'
})
export class GetAxiesService {

  private API_AXIE: string = 'https://graphql-gateway.axieinfinity.com/graphql';

  constructor(private http: HttpClient) { }

  get(scholar: Scholar): Promise<AxiesData[]>{
    return new Promise((resolve, reject)=>{
      this.http.post(this.API_AXIE, graphqlBodyAxie.getBodyDetail(scholar)).subscribe((res: any)=>{
        let axiesData: AxiesData[] = [];
        let axieDataOficial: AxiesOficialData = res;
        if(axieDataOficial.data != null){
          axieDataOficial.data.axies.results.forEach((result: AxiesResultsOficialData)=>{
            axiesData.push(this.setAxieData(result, scholar.roninAddress, scholar.name));
          })
        }
        resolve(axiesData);
      }, (error)=>{
        reject(scholar);
      });

    });
  }

  private setAxieData(axiesParse: AxiesResultsOficialData, roningAdress: string, nameUser: string): AxiesData{
    return {
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
      parts: axiesParse.parts,
      genes: axiesParse.genes,
      auction: (axiesParse.auction)? axiesParse.auction : undefined
    };
  }
}
