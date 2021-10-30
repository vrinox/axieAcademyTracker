import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { scholarOfficialData, ParseUserData } from 'src/app/models/interfaces';
import { Scholar } from 'src/app/models/scholar';


@Injectable({
  providedIn: 'root'
})
export class ScholarDataService {

  private REST_API_SERVER = 'https://game-api.axie.technology/api/v1/';

  constructor(private httpClient: HttpClient) { }

  public async get(scholar: Scholar[]): Promise<any>{
    return new Promise((resolve)=>{
      let multiRoning: String = this.setRoningAdress(scholar);
      this.httpClient.get(`${this.REST_API_SERVER}${multiRoning}`)
      .subscribe(res=>{
        let axiesUserData: scholarOfficialData[] =  this.parserJson(res);
        resolve(axiesUserData);
      });
    });
  }
  public async getOne(roninAddress: string): Promise<any>{
    return new Promise((resolve)=>{
      this.httpClient.get(`${this.REST_API_SERVER}${roninAddress}`)
      .subscribe((res: any)=>{        
        resolve(res);
      });
    });
  }

  private setRoningAdress(scholar: Scholar[]){
    let multiRoning: String = '';
    let longArray: number = scholar.length - 1;
    scholar.forEach((element, index) => {
      if(longArray != index){
        multiRoning += `${element.roninAddress},`;
      }else{
        multiRoning += `${element.roninAddress}`;
      }
    });
    return multiRoning;
  }

  private parserJson(newDataScholar: object){
    let scholarData: any = Object.entries(newDataScholar)
    .map((scholarData: ParseUserData[])=>{
      return this.parseData(scholarData);
    });
    return scholarData;
  }

  private parseData(axiesUserData: ParseUserData[]){
    return {
      ronin_address: axiesUserData[0],
      ronin_slp: axiesUserData[1].ronin_slp!,
      total_slp: axiesUserData[1].total_slp!,
      in_game_slp: axiesUserData[1].in_game_slp!,
      rank: axiesUserData[1].rank!,
      mmr: axiesUserData[1].mmr!,
      total_matches: axiesUserData[1].total_matches!,
      ign: axiesUserData[1].name!
    }
  }
}
