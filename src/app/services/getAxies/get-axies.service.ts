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
    return new Promise((resolve)=>{
      this.http.get(`${this.api_url}_axies/${roningAdress}`).subscribe((res: any)=>{
        let axiesData: AxiesData[] = [];
        let axieDataOficial: AxiesOficialData = res;
        axieDataOficial.available_axies.results.forEach((Result: AxiesResultsOficialData)=>{
          let axiesParse: AxiesParseData = this.parseAxies(Result);
          axiesData.push({
            roning: roningAdress,
            name: nameUser,
            axies: axiesParse.axies,
            parts: axiesParse.parts,
            stats: axiesParse.stats
          });
        })
        resolve(axiesData);
      });
    });
  }

  private parseAxies(axiesParse: AxiesResultsOficialData): AxiesParseData{
    let axiesData: AxiesParseData = {
      axies: {
        name: axiesParse.name,
        class: axiesParse.class,
        image: axiesParse.image,
        breedCount: axiesParse.breedCount
      },
      parts: axiesParse.parts,
      stats: axiesParse.stats
    }
    
    return axiesData
  }
}
