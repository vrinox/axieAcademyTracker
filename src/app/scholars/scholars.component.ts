import { Component, OnInit, ViewChild } from '@angular/core';
import { Scholar } from '../models/scholar';
import { ScholarDataService } from 'src/app/services/scholarData/scholar-data.service';
import { DatabaseService } from '../services/database/database.service';
import { scholarOfficialData, scholarFirebaseI, community } from '../models/interfaces';
import { Observable, Subject } from 'rxjs';
import { AgregarNewBecadoService } from '../services/agregarNewBecado/agregar-new-becado.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SessionsService } from '../services/sessions/sessions.service';
import { ComunityService } from '../services/community.service';

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
    private sessions: SessionsService,
    private communityService: ComunityService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
    this.newBecado();
  }

  async cargarDatos() {
    let scholars = await this.obtainDataFromDB();
    this.scholars = scholars;
    this.scholars.sort((a: Scholar, b: Scholar) => {
      return b.monthSLP - a.monthSLP
    });
    this.scholars$.next(this.scholars);
    this.sessions.setScholar(this.scholars);
    this.dataSource = new MatTableDataSource(this.scholars);
    this.dataSource.sort = this.sort!;
    this.sessions.setLoading(false);
    this.obtenerDatos(scholars);
  }
  async obtainDataFromDB() {
    const memberAddressList = await this.communityService.getMembersAddressList(this.communityService.activeCommunity.id);
    return await this.dbService.getScholarsByAddressList(memberAddressList);
  }
  calcularRankMensual() {
    const community: community = this.communityService.activeCommunity;
    let rank = 1;
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      return b[community.rankType] - a[community.rankType];
    }).map((scholar: Scholar) => {
      scholar.mounthlyRank = rank;
      rank++;
      return scholar;
    });
  }

  async obtenerDatos(scholarFirebase: Scholar[]) {
    let scholarsUpdated: Scholar[] = await this.schDataService.get(scholarFirebase)
      .then((scholarData: scholarOfficialData[]) => {
        return scholarData.map((scholar: scholarOfficialData) => {
          let newScholarData: Scholar = new Scholar();
          return newScholarData.parse(scholar);
        });
      });
    this.scholars = scholarFirebase.map((scholar: Scholar) => {
      let scholarUpdated: Scholar = scholarsUpdated.find((updatedData: Scholar) => {
        return updatedData.roninAddress === scholar.roninAddress;
      }) || new Scholar();
      scholar.update(scholarUpdated);
      return scholar;
    });
    this.scholars$.next(this.scholars);
    this.calcularRankMensual();
  }

  newBecado(): void {
    this.addNewBecado.getNewBecado().subscribe((scholar: Scholar) => {
      let tempScholars = this.scholars
      tempScholars.push(scholar);
      this.scholars = [];
      this.scholars = tempScholars.map((scholar) => {
        return scholar;
      });
    })
  }

  changeScholars(): Observable<Scholar[]> {
    return this.scholars$
  }

  viewOneScholarHistoric(roninAddress: string): void {
    this.router.navigate([`/historic/${roninAddress}`]);
  }

  viewAxie(scholar: Scholar): void {
    this.sessions.oneScholar.push(scholar);
    this.router.navigate(['/axies']);
  }

}

