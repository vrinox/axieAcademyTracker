import { Component, OnInit, ViewChild } from '@angular/core';
import { Scholar } from '../../models/scholar';
import { DatabaseService } from '../../services/database/database.service';
import {  community } from '../../models/interfaces';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SessionsService } from '../../services/sessions/sessions.service';
import { ComunityService } from '../../services/community.service';
import { FormControl } from '@angular/forms';
import { HistoricService } from 'src/app/services/historic/historic.service';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import english from '../../../assets/json/lenguaje/englishLanguage.json';
import spanish from '../../../assets/json/lenguaje/spanishLanguaje.json';
import { StorageService } from 'src/app/services/storage/storage.service';
@Component({
  selector: 'app-story-day',
  templateUrl: './story-day.component.html',
  styleUrls: ['./story-day.component.sass']
})
export class StoryDayComponent implements OnInit {
  scholars: Scholar[] = [];
  displayedColumns: string[] = ['name', 'totalSLP', 'todaySLP', 'yesterdaySLP', 'monthSLP', 'monthlyRank', 'MMR'];
  @ViewChild(MatSort, { static: false }) sort?: MatSort;
  dataSource: MatTableDataSource<Scholar> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  myControl = new FormControl();
  dias: any[] = [];
  membersAddressList: string[] = [];

  idiom: any = {};

  dark: boolean = false;

  constructor(
    private dbService: DatabaseService,
    private sessions: SessionsService,
    private communityService: ComunityService,
    private storyService: HistoricService,
    private storage: StorageService
  ) { 
    this.myControl.valueChanges.subscribe(async (value)=>{
      const startOfDay: Date = moment(new Date(value)).subtract(1, 'day').endOf('day').toDate();
      const endOfDay = moment(new Date(value)).add(1, 'day').startOf('day').toDate();
      const data = await this.storyService.getHistoricDay(startOfDay, endOfDay, this.membersAddressList.map(r => r));
      this.scholars = data;
      this.dataSource = new MatTableDataSource(this.scholars);
      this.dataSource.sort = this.sort!;  
    });
  }

  async ngOnInit(): Promise<void> {
    this.dark = this.sessions.dark;
    this.changeDarkMode();
    this.getLangueaje();
    this.changeIdiom();
    await this.cargarDatos();
  }

  changeDarkMode(): void{
    this.sessions.getDarkMode().subscribe(mode=>{
      this.dark = mode;
    });
  }

  getLangueaje(): void{
    let lenguage: string | null = this.storage.getItem('language');
    if(lenguage === 'es-419' || lenguage === 'es'){
      this.idiom = spanish.storyDay;
    }else{
      this.idiom = english.storyDay;
    };
  }

  
  changeIdiom():void{
    this.sessions.getIdiom().subscribe(change=>{
      if(change){
        this.getLangueaje();
      }
    })
  }

  async cargarDatos() {
    let scholars = await this.obtainDataFromDB();
    this.scholars = scholars;
    this.scholars.sort((a: Scholar, b: Scholar) => {
      return b.monthSLP - a.monthSLP
    });
    this.sessions.setScholar(this.scholars);
    this.dataSource = new MatTableDataSource(this.scholars);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort!;
    this.sessions.setLoading(false);
  }
  async obtainDataFromDB() {
    const membersAddressList = await this.communityService.getMembersAddressList(this.communityService.activeCommunity.id);
    this.membersAddressList = membersAddressList.map(r => r);
    return await this.dbService.getScholarsByAddressList(membersAddressList);
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

  filterName(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
