export class Scholar {
   id!            : number;
   roninAddress!  : string;
   name!          : string;
   todaySLP!      : number;
   yesterdaySLP!  : number;
   MMR!           : number;
   totalSLP!      : number;
   inGameSLP!     : number;
   inRoninSLP!    : number;
   averageSLP!    : number;
   mounthlyRank!  : number;
   monthSLP!      : number;
   lastMonthSLP!  : number; 

   constructor(values: Object = {}) {
        Object.assign(this, values);
   }
  getValues(){
    return {
      id          : this.id,
      roninAddress: this.roninAddress,
      name        : this.name,
      todaySLP    : this.todaySLP || 0,
      yesterdaySLP: this.yesterdaySLP || 0,
      MMR         : this.MMR || 0,
      totalSLP    : this.totalSLP || 0,
      inGameSLP   : this.inGameSLP || 0,
      inRoninSLP  : this.inRoninSLP || 0,
      averageSLP  : this.averageSLP || 0,
      mounthlyRank: this.mounthlyRank || 0,
      monthSLP    : this.monthSLP || 0,
      lastMonthSLP: this.lastMonthSLP
    }
  }
}