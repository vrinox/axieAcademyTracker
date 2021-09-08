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
<<<<<<< HEAD
  displayedColumns: string[] = ['name', 'totalSLP', 'MMR'];
=======
  displayedColumns: string[] = ['name', 'totalSLP', 'todaySLP', 'yesterdaySLP', 'monthSLP', 'monthlyRank', 'MMR'];
>>>>>>> 43a85defc7e53ef7717cada81f2bd515858907d7
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
<<<<<<< HEAD

  async obtenerDatos() {
    await Promise.all(
      this.scholars.map( (scholar: Scholar)=> {
        return this.actualizarDatos(scholar);
      }));
    this.historialView = true;
  }

  actualizarDatos(scholar: Scholar) {
=======
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
  }
  obtenerDataActualizada(scholar: Scholar) {
>>>>>>> 43a85defc7e53ef7717cada81f2bd515858907d7
    return this.schDataService
      .get(scholar.roninAddress)
      .toPromise()
      .then((scholarData: scholarOfficialData)=>{
<<<<<<< HEAD
        scholar.parse(scholarData);
        return Promise.resolve();
=======
        let newScholarData:Scholar = new Scholar();
        newScholarData.parse(scholarData);
        return Promise.resolve(newScholarData);
>>>>>>> 43a85defc7e53ef7717cada81f2bd515858907d7
      });
  }
}
