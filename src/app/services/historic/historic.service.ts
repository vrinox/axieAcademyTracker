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

  async getMontHistoric(firtsDate: Date, lastDate: Date): Promise<Scholar[]>{
    const querySnapshot = await getDocs(query(collection(this.db, "historic"), where('lastUpdate', ">", firtsDate), where('lastUpdate', "<", lastDate)));
    const story: Scholar[] = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      const rawScholar = doc.data();
      rawScholar.lastUpdate = rawScholar.lastUpdate.toDate();
      return new Scholar(rawScholar);
    })
    return story;
  }

  async getHistoricPlayer(roninAddress: string[]): Promise<Scholar[]>{
    const querySnapshot = await getDocs(query(collection(this.db, "historic"), where('roninAddress', "in", roninAddress)));
    const story: Scholar[] = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      const rawScholar = doc.data();
      rawScholar.lastUpdate = rawScholar.lastUpdate.toDate();
      return new Scholar(rawScholar);
    })
    return story;
  }
  
}
