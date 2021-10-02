import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AxiesParseData, AxiesOficialData, AxiesData } from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GetAxiesService {

  private api_url: string = 'https://api.lunaciaproxy.cloud/';

  constructor(private http: HttpClient) { }

  get(roningAdress: string, nameUser: string): Promise<AxiesData>{
    return new Promise((resolve)=>{
      this.http.get(`${this.api_url}_axies/${roningAdress}`).subscribe((res: any)=>{
        let axiesData: AxiesData = {
          roning: roningAdress,
          name: nameUser,
          axiesParts: this.parseAxies(res)
        };
        resolve(axiesData);
      });
    });
  }

  private parseAxies(axiesParse: AxiesParseData): AxiesOficialData[]{
    let axiesData: AxiesOficialData[] = []
    axiesParse.available_axies.results.forEach(axie=>{
      axiesData.push({
        axies: {
          name: axie.name,
          class: axie.class,
          image: axie.image
        },
        stats: axie.stats,
        parts: axie.parts
        });
    });
    return axiesData
  }
}
