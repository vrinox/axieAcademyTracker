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
import * as moment from 'moment';
@Component({
  selector: 'app-report-daily-general',
  templateUrl: './report-daily-general.component.html',
  styleUrls: ['./report-daily-general.component.sass']
})
export class ReportDailyGeneralComponent implements OnInit {

  scholars: Scholar[] = [];
  displayedColumns: string[] = ['name', 'totalSLP', 'todaySLP', 'average', 'yesterdaySLP', 'monthSLP', 'weekSLP'];
  @ViewChild(MatSort, { static: false }) sort?: MatSort;
  dataSource: MatTableDataSource<Scholar> = new MatTableDataSource();
  storyLabels: any[] = [];
  myControl = new FormControl();
  dias: any[] = [];
  membersAddressList: string[] = [];
  Months = new FormControl();
  MonthsAbbreviation: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthsValue: number[] = []

  constructor(
    private dbService: DatabaseService,
    private sessions: SessionsService,
    private communityService: ComunityService,
    private storyService: HistoricService
  ) {
    this.myControl.valueChanges.subscribe(async (value) => {

    });
  }

  async ngOnInit(): Promise<void> {
    const initDate = new Date().getMonth() + 1;
    this.init(initDate.toString());
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

  async init(month: string) {
    const baseDate = new Date(month+'-01-2021');
    const startOfDay: Date = moment(baseDate).startOf('month').toDate();
    const endOfDay = moment(baseDate).endOf('month').toDate();
    
    const membersAddressList = await this.communityService.getMembersAddressList(this.communityService.activeCommunity.id);
    this.membersAddressList = membersAddressList.map(r => r);
    const data = await this.storyService.getHistoricDay(startOfDay, endOfDay, this.membersAddressList.map(r => r));
    console.log(data);
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
    this.init(this.Months.value)
    console.log(this.Months.value)
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
    this.parseMonth(months)
  }

  parseMonth(months: number[]){
    this.monthsValue = months.map((month: number) => month += 1);
  }
}
