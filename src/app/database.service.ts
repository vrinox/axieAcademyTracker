import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get } from 'firebase/database';
import { scholarFirebaseI} from './models/interfaces'
import { Observable, Subject } from 'rxjs';

const app = initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public db = ref(getDatabase(app));
  public sub: Subject<scholarFirebaseI[]> = new Subject();
  constructor() { 
    
  }
  
  getAllData(): Observable<scholarFirebaseI[]>{
    get(child(this.db, `scholars/`)).then((snapshot) => {
      if (snapshot.exists()) {
        this.sub.next(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return this.sub
  }


}
