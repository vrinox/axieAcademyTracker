import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, QueryDocumentSnapshot, where, doc } from 'firebase/firestore';
import { scholarFirebaseI, userLink } from 'src/app/models/interfaces';
import { Subject } from 'rxjs';
import { Scholar } from 'src/app/models/scholar';
import { Axie } from 'src/app/models/axie';
import { addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';

const app = initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public db = getFirestore(app);
  public sub: Subject<scholarFirebaseI[]> = new Subject();
  constructor() {

  }
  async tryConection(){
    try{
      const querySnapshot = await getDocs(collection(this.db, 'scholars'));
      return true;
    } catch(err) {
      return false
    }
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
      rawScholar.id = doc.id;
      return new Scholar(rawScholar);
    })
    return story;
  }
  async getScholar(field: string, value: string): Promise<Scholar> {
    const querySnapshot = await getDocs(query(collection(this.db, "scholars"), where(field, "==", value)));
    const dbScholar = (querySnapshot.docs[0]) ? querySnapshot.docs[0].data() : null;
    return (!dbScholar) ? new Scholar() : new Scholar(dbScholar);
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
  async addUserLink(userLinkData: userLink): Promise<string>{
    const dbRef = await addDoc(collection(this.db,"userLink"), userLinkData);
    const doc = await getDoc(dbRef);
    return doc.data()!.uid;
  }
  async getScholarsByAddressList(membersAddressList: string[]): Promise<Scholar[]> {
    let batches = [];
    while (membersAddressList.length) {
      const batch = membersAddressList.splice(0, 10);
      batches.push(
        new Promise(response => {
          getDocs(query(collection(this.db, 'scholars'), where('roninAddress', 'in', batch)))
            .then(results => response(results.docs.map(result => ({ ...result.data() }))))
        })
      )
    }
    let scholars = await Promise.all(batches).then(content => {
      const all: any = []
      content.forEach((rawScholars: any) => {
        rawScholars.forEach((raw: any) => {
          all.push(new Scholar(raw))
        })
      });
      return all;
    })
    return scholars;
  }

  async updateDB(scholars: Scholar[]): Promise<void> {
    return new Promise((resolve) => {
      const dbRef = collection(this.db, "scholars");
      scholars.forEach(async (scholar: Scholar) => {
        const insertData: any = scholar.getValues();
        insertData.todaySLP = 0;
        const snapshot = await getDocs(query(dbRef, where("roninAddress", "==", scholar.roninAddress)));
        snapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, insertData);
        });
      });
      resolve();
    });
  };
  
  async addScholar(scholar:Scholar) {
    console.log('scholar', scholar);
    const dbRef = await addDoc(collection(this.db,"scholars"), scholar.getValues());
    return dbRef.id;
  }

  async deleteScholar(ronin: string){
    const dbRef = collection(this.db, "scholars");
    const snapshot = await getDocs(query(dbRef, where("roninAddress", "==", ronin)));
    deleteDoc(doc(this.db, 'scholars', snapshot.docs[0].id));
  }
}
