import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Scholar } from 'src/app/models/scholar';

@Injectable({
  providedIn: 'root'
})

export class InsertScholarsService {
  private urlApiDb = 'https://us-central1-axieacademytracker.cloudfunctions.net';

  constructor(private http: HttpClient) { }

  insertNewScholar(newScholars: FormGroup){
    this.http.post(`${this.urlApiDb}/addNewScholar`, newScholars ).subscribe(res=>{
      console.log(res);
    });
  }

}
