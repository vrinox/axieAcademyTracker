import { Component, OnInit } from '@angular/core';
import { Scholar } from '../models/scholar';
import { ScholarDataService } from '../scholar-data.service';
import { DatabaseService } from '../database.service';
import { scholarOfficialData, scholarFirebaseI } from '../models/interfaces';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-scholars',
  templateUrl: './scholars.component.html',
  styleUrls: ['./scholars.component.sass']
})
export class ScholarsComponent implements OnInit {
  scholars: Scholar[] = [];
  scholars$: Subject<Scholar[]> = new Subject();
  displayedColumns: string[] = ['name', 'totalSLP', 'todaySLP', 'yesterdaySLP', 'monthSLP', 'monthlyRank', 'MMR'];
  constructor(
    private schDataService: ScholarDataService,
    private dbService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }
  
  cargarDatos() {
    this.dbService
      .getAllData()
      .then((scholarData:scholarFirebaseI[])=> {
        console.log(scholarData);
        let scholarsFirebase = scholarData
          .map((scholar)=>{
            return new Scholar(scholar)
          });
        this.scholars = scholarsFirebase;
        this.scholars$.next(this.scholars);
        this.obtenerDatos(scholarsFirebase);
      })
  }
  
  calcularRankMensual() {
    let rank = 1;
    this.scholars = this.scholars.sort((a:Scholar, b:Scholar)=>{
      return b.monthSLP -a.monthSLP;
    }).map((scholar:Scholar)=>{
      scholar.mounthlyRank = rank;
      rank++;
      return scholar;
    });
  }

  async obtenerDatos(scholarFirebase:Scholar[]) {
    let scholarsUpdated:Scholar[] = await Promise.all(scholarFirebase.map((scholar: Scholar)=> {
      return this.obtenerDataActualizada(scholar);
    }))
    this.scholars = scholarFirebase.map((scholar:Scholar)=>{
      let scholarUpdated:Scholar = scholarsUpdated.find((updatedData:Scholar)=>{
        return updatedData.roninAddress === scholar.roninAddress;
      }) || new Scholar();
      scholar.update(scholarUpdated);
      return scholar;
    });
    this.scholars$.next(this.scholars);
    this.calcularRankMensual();
  }

  obtenerDataActualizada(scholar: Scholar) {
    return this.schDataService
      .get(scholar.roninAddress)
      .then((scholarData: scholarOfficialData)=>{
        let newScholarData:Scholar = new Scholar();
        newScholarData.parse(scholarData);
        return Promise.resolve(newScholarData);
      });
  }

  changeScholars(): Observable<Scholar[]>{
    return this.scholars$
  }

}
