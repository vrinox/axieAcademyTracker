import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Scholar } from 'src/app/models/scholar';

@Injectable({
  providedIn: 'root'
})
export class AgregarNewBecadoService {
  private newBecado$: Subject<Scholar> = new Subject();
  
  constructor() { }

  setNewBecado(scholar: Scholar):void{
    this.newBecado$.next(scholar);
  }

  getNewBecado(): Observable<Scholar>{
    return this.newBecado$;
  };
}
