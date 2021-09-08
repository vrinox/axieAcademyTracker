import { Component, OnInit } from '@angular/core';
import { Scholar } from '../models/scholar';
import { ScholarDataService } from '../scholar-data.service';
import { DatabaseService } from '../database.service';
import { scholarOfficialData, scholarFirebaseI } from '../models/interfaces';

@Component({
  selector: 'app-scholars',
  templateUrl: './scholars.component.html',
  styleUrls: ['./scholars.component.sass']
})
export class ScholarsComponent implements OnInit {
  scholars: Scholar[] = [];
  displayedColumns: string[] = ['name', 'totalSLP', 'todaySLP', 'yesterdaySLP', 'monthSLP', 'monthlyRank', 'MMR'];
  historialView: boolean = false;
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
      .subscribe((scholarData:scholarFirebaseI[])=> {
        let scholarsFirebase = scholarData
          .map((scholar)=>{
            return new Scholar(scholar)
          });
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
      this.historialView = true;
      this.calcularRankMensual();
  }
  obtenerDataActualizada(scholar: Scholar) {
    return this.schDataService
      .get(scholar.roninAddress)
      .toPromise()
      .then((scholarData: scholarOfficialData)=>{
        let newScholarData:Scholar = new Scholar();
        newScholarData.parse(scholarData);
        return Promise.resolve(newScholarData);
      });
  }
}
