import { Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { getDocs, query, QueryDocumentSnapshot, where  } from '@firebase/firestore';
import { Scholar } from 'src/app/models/scholar';

@Injectable({
  providedIn: 'root'
})
export class HistoricService {

  constructor(
    private db: Firestore,
  ) { }


  async getHistoric(roninAddress:string) {
    const querySnapshot = await getDocs(query(collection(this.db, "historic"), where('roninAddress', "==", roninAddress)));
    const story = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      const rawScholar = doc.data();
      rawScholar.lastUpdate = rawScholar.lastUpdate.toDate();
      return new Scholar(rawScholar);
    })
    return story;
  }

  async getMontHistoric(firtsDate: Date, lastDate: Date) {
    const querySnapshot = await getDocs(query(collection(this.db, "historic"), where('lastUpdate', ">", firtsDate), where('lastUpdate', "<", lastDate)));
    const story = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      const rawScholar = doc.data();
      rawScholar.lastUpdate = rawScholar.lastUpdate.toDate();
      return new Scholar(rawScholar);
    })
    return story;
  }

  async getTowScholars(roninAddress: string, roningAddress2: string) {
    const querySnapshot = await getDocs(query(collection(this.db, "historic"), where('roninAddress', "in", [roninAddress, roningAddress2])));
    const story = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      const rawScholar = doc.data();
      rawScholar.lastUpdate = rawScholar.lastUpdate.toDate();
      return new Scholar(rawScholar);
    })
    return story;
  }
  
}
