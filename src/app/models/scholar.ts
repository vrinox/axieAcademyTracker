import * as moment from "moment";
import {scholarOfficialData} from "./interfaces";
export class Scholar {
  id!: string;
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
  weekSLP: number = 0;
  lastWeekSLP: number = 0;
  ganancia: number = 50;
  personalAddress: string = "";

  constructor(values: any = {}) {
    Object.assign(this, values);
    this.roninAddress = this.parseRonin(this.roninAddress);
    this.personalAddress = this.parseRonin(values.personalAdress);
  }

  parse(unParsedData: scholarOfficialData) {
    this.roninAddress = unParsedData.ronin_address;
    this.inRoninSLP = (isNaN(unParsedData.ronin_slp)) ? 0 : unParsedData.ronin_slp;
    this.totalSLP = (isNaN(unParsedData.total_slp)) ? 0 : unParsedData.total_slp;
    this.inGameSLP = (isNaN(unParsedData.in_game_slp)) ? 0 : unParsedData.in_game_slp;
    this.PVPRank = (isNaN(unParsedData.rank)) ? 0 : unParsedData.rank;
    this.MMR = (isNaN(unParsedData.mmr)) ? 0 : unParsedData.mmr;
    this.name = (unParsedData.ign) ? unParsedData.ign : this.name;
    return this;
  }
  
  getValues():object {
    return {
      roninAddress: this.parseRonin(this.roninAddress),
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
      PVPRank: this.PVPRank || 0,
      personalAddress: this.personalAddress || ''
    }
  }

  update(newData: Scholar):void { 
    this.todaySLP = this.calculateTodaySLP(newData);
    this.monthSLP = this.calculateMonthSLP();
    this.weekSLP = this.calculateWeekSLP();
    this.averageSLP = this.calculateAverageSLP();
    this.lastUpdate = new Date(moment().startOf("day").toString());
    this.MMR = newData.MMR;
    this.PVPRank = newData.PVPRank;
    this.inGameSLP = newData.inGameSLP;
    this.inRoninSLP = newData.inRoninSLP;
    this.totalSLP = newData.totalSLP;
    this.name = newData.name;
  }

  getDaysDiffStartOf(valor:any):number {
    const startOfTheMonth = moment().startOf(valor);
    const today = moment();
    return today.diff(startOfTheMonth, "days");
  }

  calculateTodaySLP(newData: Scholar){
    return (newData.totalSLP < this.totalSLP)? newData.totalSLP: newData.totalSLP - this.totalSLP;
  }

  calculateMonthSLP(){
    if(this.getDaysDiffStartOf('month') === 0 || this.totalSLP === 0){
      this.lastMonthSLP = this.monthSLP;
      return this.todaySLP;
    } else {
      return this.monthSLP + this.todaySLP;
    }
  }

  calculateWeekSLP(){
    if(this.getDaysDiffStartOf('week') == 0 || this.totalSLP == 0){
      this.lastWeekSLP = this.lastWeekSLP;
      return this.todaySLP;
    } else {
      return this.weekSLP + this.todaySLP;
    }
  }

  calculateAverageSLP(){
    return this.monthSLP / this.getDaysDiffStartOf('month');
  }

  parseRonin(roninAddress: string){
    if(roninAddress && roninAddress.search('ronin') !== -1){
      roninAddress = "0x"+roninAddress.split(':')[1];
    }
    return roninAddress;
  }
  
}