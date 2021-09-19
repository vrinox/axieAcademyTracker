import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AxiesUserData, scholarOfficialData, ParseUserData } from 'src/app/models/interfaces';
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
        console.log(res);
        let axiesUserData: scholarOfficialData[] =  this.parserJson(res);
        resolve(axiesUserData);
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
    let scholarData: scholarOfficialData[] = Object.entries(newDataScholar)
    .map((scholarData: ParseUserData[])=>{
      let newDataOficial: AxiesUserData = {
        roninAddress: scholarData[0].roninUser,
        in_game_slp: scholarData[1].userDataAxie.in_game_slp,
        mmr: scholarData[1].userDataAxie.mmr,
        name: scholarData[1].userDataAxie.name,
        rank: scholarData[1].userDataAxie.rank,
        ronin_slp: scholarData[1].userDataAxie.ronin_slp,
        total_matches: scholarData[1].userDataAxie.total_matches,
        total_slp: scholarData[1].userDataAxie.total_slp
      }
      return this.parseData(newDataOficial);
    });
    return scholarData;
  }

  private parseData(axiesUserData: AxiesUserData){
    return {
      ronin_address: axiesUserData.roninAddress,
      ronin_slp: axiesUserData.ronin_slp,
      total_slp: axiesUserData.total_slp,
      in_game_slp: axiesUserData.in_game_slp,
      rank: axiesUserData.rank,
      mmr: axiesUserData.mmr,
      total_matches: axiesUserData.total_matches,
      ign: axiesUserData.name
    }
  }
}
