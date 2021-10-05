import { Component, OnInit, ViewChild } from '@angular/core';
import { Scholar } from '../models/scholar';
import { ScholarDataService } from 'src/app/services/scholarData/scholar-data.service';
import { DatabaseService } from '../services/database/database.service';
import { scholarOfficialData, scholarFirebaseI } from '../models/interfaces';
import { Observable, Subject } from 'rxjs';
import { AgregarNewBecadoService } from '../services/agregarNewBecado/agregar-new-becado.service';
import { Router } from '@angular/router';
import { ReferenceScholarsService } from '../services/referenceScholars/reference-scholars.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-scholars',
  templateUrl: './scholars.component.html',
  styleUrls: ['./scholars.component.sass']
})
export class ScholarsComponent implements OnInit {
  scholars: Scholar[] = [];
  scholars$: Subject<Scholar[]> = new Subject();
  displayedColumns: string[] = ['name', 'totalSLP', 'todaySLP', 'yesterdaySLP', 'monthSLP', 'monthlyRank', 'MMR'];
  @ViewChild(MatSort, { static: false }) sort?: MatSort;
  dataSource: MatTableDataSource<Scholar> = new MatTableDataSource();

  constructor(
    private schDataService: ScholarDataService,
    private dbService: DatabaseService,
    private addNewBecado: AgregarNewBecadoService,
    private router: Router,
    private referenceScholar: ReferenceScholarsService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.newBecado();
  }
  
  cargarDatos() {
    this.dbService
      .getAllData()
      .then((scholarData:scholarFirebaseI[])=> {
        let scholarsFirebase = scholarData
          .map((scholar)=>{
            return new Scholar(scholar)
          });
        this.scholars = scholarsFirebase;
        this.scholars.sort((a:Scholar,b:Scholar)=>{
          return b.monthSLP - a.monthSLP
        });
        this.scholars$.next(this.scholars);
        this.referenceScholar.set(this.scholars);
        this.obtenerDatos(scholarsFirebase);
        this.dataSource = new MatTableDataSource(this.scholars);
        this.dataSource.sort = this.sort!;
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
    let scholarsUpdated: Scholar[] = await this.schDataService.get(scholarFirebase)
    .then((scholarData: scholarOfficialData[])=>{
      return scholarData.map((scholar: scholarOfficialData)=> {
        let newScholarData:Scholar = new Scholar();
        return newScholarData.parse(scholar);
      });
    });

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

  newBecado(): void{
    this.addNewBecado.getNewBecado().subscribe((scholar:Scholar)=>{
      let tempScholars = this.scholars
      tempScholars.push(scholar);
      this.scholars = [];
      this.scholars = tempScholars.map((scholar)=>{
        return scholar;
      });
    })
  }

  changeScholars(): Observable<Scholar[]>{
    return this.scholars$
  }

  viewOneScholarHistoric(roninAddress: string): void{
    this.router.navigate([`/historic/${roninAddress}`]);
  }

  viewAxie(index: number): void{
    let scholarToString: string = JSON.stringify(this.scholars[index]);
    this.router.navigate([`axies`, scholarToString]);
  }
}
