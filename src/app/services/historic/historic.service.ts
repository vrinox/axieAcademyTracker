import { Injectable } from '@angular/core';
import { collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { getDocs, query, QueryDocumentSnapshot, where } from '@firebase/firestore';
import * as moment from 'moment';
import { Scholar } from 'src/app/models/scholar';

@Injectable({
  providedIn: 'root'
})
export class HistoricService {

  constructor(
    private db: Firestore,
  ) { }

  async getMontHistoric(firtsDate: Date, lastDate: Date): Promise<Scholar[]> {
    const querySnapshot = await getDocs(query(collection(this.db, "historic"), where('lastUpdate', ">", firtsDate), where('lastUpdate', "<", lastDate)));
    const story: Scholar[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const rawScholar = doc.data();
      rawScholar.lastUpdate = rawScholar.lastUpdate.toDate();
      return new Scholar(rawScholar);
    })
    return story;
  }

  async getHistoricPlayer(roninAddress: string[]): Promise<Scholar[]> {
    const querySnapshot = await getDocs(query(collection(this.db, "historic"), where('roninAddress', "in", roninAddress)));
    const story: Scholar[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const rawScholar = doc.data();
      rawScholar.lastUpdate = rawScholar.lastUpdate.toDate();
      return new Scholar(rawScholar);
    })
    return story;
  }  
  async getHistoricDay(startOfDay: Date, endOfDay: Date, membersAddressList: string[]): Promise<Scholar[]> {    
    let batches = [];
    while (membersAddressList.length) {      
      const batch = membersAddressList.splice(0, 10);
      batches.push(
        new Promise(response => {
          getDocs(query(collection(this.db, "historic"),where('lastUpdate', ">", startOfDay), where('lastUpdate', "<", endOfDay), where('roninAddress', "in", batch)))
            .then(results => response(results.docs.map(result => ({ ...result.data()}) )))
        })
      )
    }
    let scholars = await Promise.all(batches).then(content => {
      const all: any = []
      content.forEach((rawScholars: any) => {
        rawScholars.forEach((raw:any)=>{
          raw.lastUpdate = raw.lastUpdate.toDate();
          all.push(new Scholar(raw))
        })
      });
      return all;
    })
    return scholars;
  }
  async recalculateStory(story: Scholar[]) {
    const organizedStory = story.sort((a, b) => {
      return new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime();
    });
    let monthAcumulated = 0;
    let weekAccumulated = 0;
    let todaySLP = 0;
    organizedStory.reduce((yesterday: Scholar, today: Scholar, index: number, array: Scholar[]) => {
      if (index === 1) {
        todaySLP = (yesterday.inGameSLP < yesterday.monthSLP) ? yesterday.monthSLP : yesterday.inGameSLP;
        monthAcumulated += todaySLP;
        weekAccumulated += todaySLP;
        yesterday.todaySLP = todaySLP;
        yesterday.monthSLP = monthAcumulated;
        yesterday.weekSLP = weekAccumulated;
      }
      todaySLP = 0;
      todaySLP = (today.inGameSLP < yesterday.inGameSLP) ? today.inGameSLP : today.inGameSLP - yesterday.inGameSLP;
      monthAcumulated = this.calculateMonthAcc(todaySLP, monthAcumulated, today.lastUpdate);
      weekAccumulated = this.calculateWeekAcc(todaySLP, weekAccumulated, today.lastUpdate);
      today.todaySLP = todaySLP;
      today.monthSLP = monthAcumulated;
      today.weekSLP = weekAccumulated;
      today.yesterdaySLP = yesterday.todaySLP;
      return today;
    })
  }
  private calculateMonthAcc(todaySLP: number, monthAcumulated: number, actualDate: any) {
    if (this.getDaysDiffStartOf('month', actualDate) === 0) {
      monthAcumulated = 0;
    }
    return monthAcumulated + todaySLP;
  }
  private calculateWeekAcc(todaySLP: number, weekAccumulated: number, actualDate: any) {
    if (this.getDaysDiffStartOf('week', actualDate) === 0) {
      weekAccumulated = 0;
    }
    return weekAccumulated + todaySLP;
  }
  private getDaysDiffStartOf(valor: any, actualDate: string): number {
    const today = moment(new Date(actualDate).toISOString());
    const startOfTheMonth = moment(today).startOf(valor);
    return today.diff(startOfTheMonth, "days");
  }
  getMonthBoundaries(month: number, year: number){
    const date = moment(`15/${month}/${year}`, "DD/MM/YYYY").toISOString();
    return {
      start: moment(date).startOf('month'),
      end: moment(date).endOf('month')
    }
  }
  async updateStoryDay(day: Scholar){
    const docRef = doc(this.db, 'historic', day.id);
    await updateDoc(docRef, day.getValues());
  }
}
