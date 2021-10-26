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

  myControl = new FormControl();
  dias: any[] = [];
  membersAddressList: string[] = [];
  constructor(
    private dbService: DatabaseService,
    private sessions: SessionsService,
    private communityService: ComunityService,
    private storyService: HistoricService
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
    await this.cargarDatos();
  }

  async cargarDatos() {
    let scholars = await this.obtainDataFromDB();
    this.scholars = scholars;
    this.scholars.sort((a: Scholar, b: Scholar) => {
      return b.monthSLP - a.monthSLP
    });
    this.sessions.setScholar(this.scholars);
    this.dataSource = new MatTableDataSource(this.scholars);
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

}
