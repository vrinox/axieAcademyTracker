import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatosFormulario } from 'src/app/models/interfaces';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class InsertScholarsService {
  private urlApiDb = 'https://us-central1-axieacademytracker.cloudfunctions.net';

  constructor(private http: HttpClient) { }

  insertNewScholar(newScholars: DatosFormulario): Promise<any>{
    return new Promise((resolve)=>{
      this.http.post(`${this.urlApiDb}/addNewScholar`, newScholars ).subscribe((res: any)=>{
        newScholars.id = res.id
        delete newScholars.personalAdress;
        delete newScholars.ganancia
        resolve(newScholars);
      });
    })
  }

}
