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
  displayedColumns: string[] = ['name', 'totalSLP', 'MMR'];
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
        console.log(scholarData);
        this.scholars = scholarData
          .map((scholar)=>{
            return new Scholar(scholar)
          });
        this.obtenerDatos();
      })
  }

  async obtenerDatos() {
    await Promise.all(
      this.scholars.map( (scholar: Scholar)=> {
        return this.actualizarDatos(scholar);
      }));
    this.historialView = true;
  }

  actualizarDatos(scholar: Scholar) {
    return this.schDataService
      .get(scholar.roninAddress)
      .toPromise()
      .then((scholarData: scholarOfficialData)=>{
        scholar.parse(scholarData);
        return Promise.resolve();
      });
  }
}
