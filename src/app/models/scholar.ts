import {scholarOfficialData} from "./interfaces";
export class Scholar {
  id!: number;
  roninAddress: string = "";
  name!: string;
  todaySLP: number = 0;
  yesterdaySLP: number = 0;
  MMR: number = 0;
  totalSLP: number = 0;
  inGameSLP: number = 0;
  inRoninSLP: number = 0;
  averageSLP: number = 0;
  PVPRank: number = 0;
  mounthlyRank: number = 0;
  monthSLP: number = 0;
  lastMonthSLP: number = 0;
  lastUpdate: Date = new Date;
  WinRate!: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  parse(unParsedData: scholarOfficialData) {
    this.roninAddress = unParsedData.ronin_address;
    this.inRoninSLP = (isNaN(unParsedData.ronin_slp)) ? 0 : unParsedData.ronin_slp;
    this.totalSLP = (isNaN(unParsedData.total_slp)) ? 0 : unParsedData.total_slp;
    this.inGameSLP = (isNaN(unParsedData.in_game_slp)) ? 0 : unParsedData.in_game_slp;
    this.PVPRank = (isNaN(unParsedData.rank)) ? 0 : unParsedData.rank;
    this.MMR = (isNaN(unParsedData.mmr)) ? 0 : unParsedData.mmr;
    return this;
  }
  
  getValues():object {
    return {
      roninAddress: this.roninAddress,
      name: this.name,
      todaySLP: this.todaySLP || 0,
      yesterdaySLP: this.yesterdaySLP || 0,
      MMR: this.MMR || 0,
      totalSLP: this.totalSLP || 0,
      inGameSLP: this.inGameSLP || 0,
      inRoninSLP: this.inRoninSLP || 0,
      averageSLP: this.averageSLP || 0,
      mounthlyRank: this.mounthlyRank || 0,
      monthSLP: this.monthSLP || 0,
      lastMonthSLP: this.lastMonthSLP || 0,
      PVPRank: this.PVPRank || 0
    }
  }
  update(newData: Scholar):void {
    this.todaySLP = newData.totalSLP - this.totalSLP;
    this.monthSLP = this.monthSLP + this.todaySLP;
    this.MMR = newData.MMR;
    this.PVPRank = newData.PVPRank;
    this.inGameSLP = newData.inGameSLP;
    this.inRoninSLP = newData.inRoninSLP;
    this.totalSLP = newData.totalSLP;
  }
}