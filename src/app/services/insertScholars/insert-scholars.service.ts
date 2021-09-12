import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class InsertScholarsService {
  private urlApiDb = 'https://us-central1-axieacademytracker.cloudfunctions.net';

  private httpOptions = {
    headers: new HttpHeaders({ 
      "key": "Access-Control-Allow-Origin",
      "value": "*"
    })
  };
  
  constructor(private http: HttpClient) { }

  insertNewScholar(newScholars: Object){
    this.http.post(`${this.urlApiDb}/addNewScholar`, newScholars, this.httpOptions ).subscribe(res=>{
      console.log(res);
    });
  }

}
