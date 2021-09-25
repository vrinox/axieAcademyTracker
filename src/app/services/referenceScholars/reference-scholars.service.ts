import { Injectable } from '@angular/core';
import { Scholar } from 'src/app/models/scholar';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenceScholarsService {
  scholar: Scholar[] = [];
  private scholar$: Subject<Scholar[]> = new Subject;

  constructor() { }

  get(): Observable<Scholar[]>{
    return this.scholar$;
  }

  set(scholars: Scholar[]): void{
    this.scholar = scholars;
    this.scholar$.next(scholars);
  }
}
