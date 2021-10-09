import { Injectable } from '@angular/core';
import { Scholar } from 'src/app/models/scholar';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  scholar: Scholar[] = [];
  oneScholar: Scholar[] = [];
  private scholar$: Subject<Scholar[]> = new Subject;

  constructor() {}

  getScholar(): Observable<Scholar[]>{
    return this.scholar$;
  }

  setScholar(scholars: Scholar[]): void{
    this.scholar = scholars;
    this.scholar$.next(scholars);
  }

}
