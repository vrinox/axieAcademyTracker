import { Component, OnInit, ViewChild } from '@angular/core';
import { Scholar } from '../models/scholar';
import { ScholarDataService } from 'src/app/services/scholarData/scholar-data.service';
import { scholarOfficialData, community } from '../models/interfaces';
import { Observable, Subject } from 'rxjs';
import { AgregarNewBecadoService } from '../services/agregarNewBecado/agregar-new-becado.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SessionsService } from '../services/sessions/sessions.service';
import { ComunityService } from '../services/community.service';
import { MatPaginator } from '@angular/material/paginator';
import spanish from '../../assets/json/lenguaje/spanishLanguaje.json';
import english from '../../assets/json/lenguaje/englishLanguage.json';
import { StorageService } from '../services/storage/storage.service';

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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<Scholar> = new MatTableDataSource();
  idiom: any = {};
  dark: boolean = false;

  constructor(
    private schDataService: ScholarDataService,
    private addNewBecado: AgregarNewBecadoService,
    private router: Router,
    private sessions: SessionsService,
    private communityService: ComunityService,
    private storage: StorageService
  ) { }
  
  async ngOnInit(): Promise<void> {
    this.sessions.start$.subscribe(async (isStart:boolean)=>{
      if(isStart){
        this.changeScholar();
        this.dark = this.sessions.dark;
        this.changeDarkMode();
        this.getLangueaje();
        this.changeIdiom();
        await this.sessions.obtainDataFromDB();
        this.cargarDatos();
        this.newBecado();
      }
    })
    if(this.sessions.isStart){   
      this.changeScholar();
      this.changeDarkMode();
      this.getLangueaje();
      this.changeIdiom();
      await this.sessions.obtainDataFromDB();
      this.dark = this.sessions.dark;
      this.cargarDatos();
      this.newBecado();
    }
  }

  changeDarkMode(): void{
    this.sessions.getDarkMode().subscribe(mode=>{
      this.dark = mode;
    });
  }

  getLangueaje(): void{
    let lenguage: string | null = this.storage.getItem('language');
    if(lenguage === 'es-419' || lenguage === 'es'){
      this.idiom = spanish.scholars;
    }else{
      this.idiom = english.scholars;
    };
  }

  changeIdiom():void{
    this.sessions.getIdiom().subscribe(change=>{
      if(change){
        this.getLangueaje();
      }
    })
  }

  changeScholar():void{
    this.sessions.getScholar().subscribe(scholars=>{
      this.cargarDatos();
    })
  }

  async cargarDatos() {
    this.scholars = [... this.sessions.scholar];
    this.scholars.sort((a: Scholar, b: Scholar) => {
      return b.monthSLP - a.monthSLP
    });
    this.dataSource = new MatTableDataSource(this.scholars);
    this.dataSource.sort = this.sort!;
    this.dataSource.paginator = this.paginator;
    this.sessions.setLoading(false);
    this.obtenerDatos(this.scholars);
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
      this.scholars.push(scholar)
      this.dataSource = new MatTableDataSource(this.scholars);
    })
  }

  changeScholars(): Observable<Scholar[]> {
    return this.scholars$
  }

  viewAxie(scholar: Scholar): void {
    this.sessions.oneScholar.push(scholar);
    this.router.navigate(['/axies']);
  }

  filterName(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

