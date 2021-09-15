import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { scholarFirebaseI } from 'src/app/models/interfaces';
import { Subject } from 'rxjs';

const app = initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public db = getFirestore(app);
  public sub: Subject<scholarFirebaseI[]> = new Subject();
  constructor() { 
    
  }
  async getAllData():Promise<any[]>{
    const querySnapshot = await getDocs(collection(this.db, 'scholars'))
    return querySnapshot.docs.map((doc)=>{
      return doc.data();
    });
  }


}
