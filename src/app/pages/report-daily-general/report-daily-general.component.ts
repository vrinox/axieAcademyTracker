import { Component, OnInit, ViewChild } from '@angular/core';
import { Scholar } from '../../models/scholar';
import { DatabaseService } from '../../services/database/database.service';
import { community, scholarFirebaseI } from '../../models/interfaces';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SessionsService } from '../../services/sessions/sessions.service';
import { ComunityService } from '../../services/community.service';
import { FormControl } from '@angular/forms';
import { HistoricService } from 'src/app/services/historic/historic.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import spanish from '../../../assets/json/lenguaje/spanishLanguaje.json';
import english from '../../../assets/json/lenguaje/englishLanguage.json';
import { StorageService } from 'src/app/services/storage/storage.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-report-daily-general',
  templateUrl: './report-daily-general.component.html',
  styleUrls: ['./report-daily-general.component.sass'],
  providers: [{
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReportDailyGeneralComponent implements OnInit {
  date = new FormControl(moment());
  scholars: Scholar[] = [];
  displayedColumns: string[] = ['name', 'totalSLP', 'todaySLP', 'average', 'yesterdaySLP', 'monthSLP', 'weekSLP'];
  @ViewChild(MatSort, { static: false }) sort?: MatSort;
  dataSource: MatTableDataSource<Scholar> = new MatTableDataSource();
  storyLabels: any[] = [];
  myControl = new FormControl();
  dias: any[] = [];
  membersAddressList: string[] = [];
  idiom: any = {};

  dark: boolean = false;

  constructor(
    private dbService: DatabaseService,
    private communityService: ComunityService,
    private storyService: HistoricService,
    private storage: StorageService,
    private sessions: SessionsService
  ) {
    this.myControl.valueChanges.subscribe(async (value) => {

    });
  }

  async ngOnInit(): Promise<void> {
    this.dark = this.sessions.dark;
    this.changeIdiom();
    this.getLangueaje();
    this.date.setValue('')
    const initDate = new Date().getMonth() + 1;
    this.init(initDate.toString(), new Date().getFullYear().toString());
  }

  getLangueaje(): void{
    let lenguage: string | null = this.storage.getItem('language');
    if(lenguage === 'es-419' || lenguage === 'es'){
      this.idiom = spanish.reportDaily
    }else{
      this.idiom = english.reportDaily;
    };
  }

  changeIdiom():void{
    this.sessions.getIdiom().subscribe(change=>{
      if(change){
        this.getLangueaje();
      }
    })
  }

  public createLabels(data: Scholar[]) {
    this.storyLabels = data
      .sort((a, b) => {
        return new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime();
      })
      .map((scholar: Scholar) => {
        return {
          label: moment(scholar.lastUpdate).format('DD/MM'),
          value: scholar.todaySLP
        }
      });
  };

  async init(month: string, year: string) {
    const baseDate = new Date(month+'-01-'+year);
    const startOfDay: Date = moment(baseDate).startOf('month').toDate();
    const endOfDay = moment(baseDate).endOf('month').toDate();
    
    const membersAddressList = await this.communityService.getMembersAddressList(this.communityService.activeCommunity.id);
    this.membersAddressList = membersAddressList.map(r => r);
    const data = await this.storyService.getHistoricDay(startOfDay, endOfDay, this.membersAddressList.map(r => r));
    if(data.length !== 0){
      data.sort((a: any, b: any) => {
        return a.lastUpdate - b.lastUpdate;
      })
      let acumResult: Scholar[] = [];
      let initValue = new Scholar();
      initValue.lastUpdate = data[0].lastUpdate;
      data.reduce((valorAnterior, valorActual, index, arreglo) => {
        const anteriorDateValor = moment(valorAnterior.lastUpdate).startOf('day').toDate();
        const arrDateValor = moment(arreglo[index].lastUpdate).startOf('day').toDate();
        if (anteriorDateValor.getTime() != arrDateValor.getTime()) {
          acumResult.push(valorAnterior);
          valorAnterior = new Scholar();
          valorAnterior.lastUpdate = valorActual.lastUpdate;
        }
  
        valorAnterior.inGameSLP += arreglo[index].inGameSLP;
        valorAnterior.totalSLP += arreglo[index].totalSLP;
        valorAnterior.todaySLP += arreglo[index].todaySLP;
        valorAnterior.monthSLP += arreglo[index].monthSLP;
        valorAnterior.weekSLP += arreglo[index].weekSLP;
        valorAnterior.yesterdaySLP += 1;
  
        return valorAnterior;
      }, initValue)
      this.createLabels(acumResult);
      this.scholars = acumResult.sort((a, b) => {
        return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
      })
      this.dataSource = new MatTableDataSource(this.scholars);
      this.dataSource.sort = this.sort!;
      this.getMonthActivity(data)
    }    
  }
  async obtainDataFromDB() {
    const membersAddressList = await this.communityService.getMembersAddressList(this.communityService.activeCommunity.id);
    this.membersAddressList = membersAddressList.map(r => r);
    return await this.dbService.getScholarsByAddressList(membersAddressList);
  }
  buscar() {
    this.init(moment(this.date.value._d).format('MM'), moment(this.date.value._d).format('YYYY'));
  }

  getMonthActivity(scholars: Scholar[]){
    let months: number[] = [];
    let sizeMonths: number = 0;
    scholars.forEach((scholar: Scholar)=>{
      if(months.length === 0){
        months.push(scholar.lastUpdate.getMonth());
      }else if(months[sizeMonths] !== scholar.lastUpdate.getMonth()){
        months.push(scholar.lastUpdate.getMonth());
        sizeMonths++
      }
    });
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
}
