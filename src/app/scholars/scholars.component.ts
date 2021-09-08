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
  ) { 

  }

  ngOnInit(): void {
    this.cargarDatos();
  }
  cargarDatos() {
    this.dbService
      .getAllData()
      .subscribe((scholarData:scholarFirebaseI[])=> {
        this.scholars = scholarData
          .map((scholar)=>{
            return new Scholar(scholar)
          });
        this.obtenerDatos();
      })
    
  }
  obtenerDatos() {
      this.scholars.map( (scholar: Scholar)=> {
        this.actualizarDatos(scholar);
      })
  }
  actualizarDatos(scholar: Scholar) {
    return this.schDataService
      .get(scholar.roninAddress)
      .subscribe((scholarData: scholarOfficialData)=>{
        const newScholarData = scholar.parse(scholarData);
        scholar.update(newScholarData);
      });
  }
}
