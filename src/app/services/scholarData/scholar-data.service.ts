import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { earningsData, scholarOfficialData, statsData } from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ScholarDataService {
  private REST_API_SERVER = 'https://api.lunaciaproxy.cloud';

  constructor(private httpClient: HttpClient) { }

  public async get(roninAddress: string):Promise<any>{
    let earnings, stats;
    [stats, earnings] = await Promise.all(
      [this.getStats(roninAddress),
      this.getEarnings(roninAddress)]
    );
    let apiData: scholarOfficialData = this.parseData(earnings, stats, roninAddress);
    return apiData;
  }
  private getStats(roninAddres: string):Promise<any>{
    return this.httpClient
      .get(`${this.REST_API_SERVER}/_stats/${roninAddres}`)
      .toPromise()
      .then((statsData:any)=>{
        return statsData.stats;
      })
  }
  private getEarnings(roninAddres: string):Promise<any>{
    return this.httpClient
      .get(`${this.REST_API_SERVER}/_earnings/${roninAddres}`)
      .toPromise()
      .then((earningsData:any)=>{
        return earningsData.earnings;
      })
  }
  private parseData(earnings: earningsData, stats: statsData, roninAddress: string){
    return {
      ronin_address: roninAddress,
      ronin_slp: earnings.slp_holdings,
      total_slp: earnings.slp_in_total,
      in_game_slp: earnings.slp_inventory,
      rank: stats.rank,
      mmr: stats.elo,
      total_matches: stats.win_total,
      ign: stats.name
    }
  }
}
