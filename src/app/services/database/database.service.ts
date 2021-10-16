import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { scholarFirebaseI } from 'src/app/models/interfaces';
import { Subject } from 'rxjs';
import { Scholar } from 'src/app/models/scholar';
import { Axie } from 'src/app/models/axie';

const app = initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public db = getFirestore(app);
  public sub: Subject<scholarFirebaseI[]> = new Subject();
  constructor() {

  }
  async getAllData(): Promise<any[]> {
    const querySnapshot = await getDocs(collection(this.db, 'scholars'))
    return querySnapshot.docs.map((doc) => {
      return doc.data();
    });
  }
  async getAllStory(roninAddress: string): Promise<any[]> {
    const querySnapshot = await getDocs(query(collection(this.db, "historic"), where('roninAddress', "==", roninAddress)));
    const story = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const rawScholar = doc.data();
      rawScholar.lastUpdate = rawScholar.lastUpdate.toDate();
      return new Scholar(rawScholar);
    })
    return story;
  }
  async getScholar(field: string, value: string): Promise<Scholar | null> {
    const querySnapshot = await getDocs(query(collection(this.db, "scholars"), where(field, "==", value)));
    const dbScholar = (querySnapshot.docs[0]) ? querySnapshot.docs[0].data() : null;
    return (!dbScholar) ? null : new Scholar(dbScholar);
  }

  private async getAxieAvatar(roninAddress: string): Promise<Axie> {
    const axie = new Axie();
    const userLink = await this.getUserLink('roninAddress', roninAddress);
    axie.id = (userLink) ? userLink.avatar.split('/')[5] : "";
    return axie;
  }
  async createItemList(scholar: Scholar): Promise<any> {
    const axie = await this.getAxieAvatar(scholar.roninAddress);
    return {
      scholar: scholar,
      axie: axie
    }
  }
  async getUserLink(field: string, value: string): Promise<any> {
    const querySnapshot = await getDocs(query(collection(this.db, "userLink"), where(field, "==", value)));
    const dbUserLink = (querySnapshot.docs[0]) ? querySnapshot.docs[0].data() : null;
    return (!dbUserLink) ? null : {
      avatar: dbUserLink.avatar,
      roninAddress: dbUserLink.roninAddress,
      uid: dbUserLink.uid
    }
  }
  async getScholarsByAddressList(membersAddressList: string[]):Promise<Scholar[]>{
    let batches = [];
    while (membersAddressList.length) {      
      const batch = membersAddressList.splice(0, 10);
      batches.push(
        new Promise(response => {
          getDocs(query(collection(this.db, 'scholars'),where('roninAddress', 'in', batch)))
            .then(results => response(results.docs.map(result => ({ ...result.data()}) )))
        })
      )
    }
    let scholars = await Promise.all(batches).then(content => {
      const all: any = []
      content.forEach((rawScholars: any) => {
        rawScholars.forEach((raw:any)=>{
          all.push(new Scholar(raw))
        })
      });
      return all;
    })
    return scholars;
  }
}
