import { Component, OnInit, ViewChild } from '@angular/core';
import { Scholar } from '../../models/scholar';
import { DatabaseService } from '../../services/database/database.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ComunityService } from '../../services/community.service';
import { HistoricService } from 'src/app/services/historic/historic.service';
import * as moment from 'moment';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.sass']
})
export class StoryComponent implements OnInit {
  disponibleScholars: Scholar[] = [];
  myControl = new FormControl();
  Months = new FormControl();
  namePlayerOptions: string[] = [];
  filteredOptions: Observable<string[]>;;
  scholars: Scholar[] = [];
  scholars$: Subject<Scholar[]> = new Subject();
  displayedColumns: string[] = ['lastUpdate', 'totalSLP', 'todaySLP', 'yesterdaySLP', 'monthSLP', 'weekSLP', 'monthlyRank', 'MMR'];
  @ViewChild(MatSort, { static: false }) sort?: MatSort;
  dataSource: MatTableDataSource<Scholar> = new MatTableDataSource();
  storyLabels: any[] = [];
  wholeData: Scholar[] = [];
  constructor(
    private dbService: DatabaseService,
    private communityService: ComunityService,
    private storyService: HistoricService
  ) {
    this.filteredOptions = new Observable();

  }

  async ngOnInit() {
    const memberAddressList = await this.communityService.getMembersAddressList(this.communityService.activeCommunity.id);
    this.disponibleScholars = await this.dbService.getScholarsByAddressList(memberAddressList);
    this.disponibleScholars.forEach((scholar: Scholar) => {
      this.namePlayerOptions.push(scholar.name);
    });
  }
  async cargarDatos(roninAddress: string) {
    let scholarData = await this.dbService.getAllStory(roninAddress);
    let scholarsFirebase = scholarData
      .map((scholar) => {
        scholar.lastUpdate = new Date(scholar.lastUpdate).toDateString();
        return new Scholar(scholar)
      })
      .sort((a, b) => {
        return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
      })
    this.wholeData = scholarsFirebase;
    return this.filterData(scholarsFirebase);
  }
  public filterData(data: Scholar[]) {
    let dates = this.storyService.getMonthBoundaries(this.Months.value, 2021);

    return data.filter((scholar: Scholar) => {
      return moment(scholar.lastUpdate).isBetween(dates.start, dates.end, 'days', '[]')
    });
  }
  public createLabels(data: Scholar[]) {
    this.storyLabels = data
      .sort((a, b) => {
        return new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime();
      })
      .map((scholar: Scholar) => {
        return {
          label: scholar.lastUpdate,
          value: scholar.todaySLP
        }
      });
  };
  public addDataToTable(data: Scholar[]) {
    this.scholars = data.sort((a, b) => {
      return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
    });
    this.dataSource = new MatTableDataSource(this.scholars);
    this.dataSource.sort = this.sort!;
  }
  public async buscar() {
    const name = this.myControl.value;
    const scholar = this.disponibleScholars.find((requestedScholar: Scholar) => {
      return requestedScholar.name === name;
    });
    if (scholar) {
      let scholarsFirebase = await this.cargarDatos(scholar.roninAddress);
      this.createLabels(scholarsFirebase);
      this.addDataToTable(scholarsFirebase);
    }
  }
  async recalculateWholeHistorics() {
    const todayArr: Scholar[] = await Promise.all(this.disponibleScholars.map(s => this.recalculateOneScholar(s)));
    await this.dbService.updateDB(todayArr);
    console.log('termino de recalcular');
  }
  recalculateOneScholar(s: Scholar):Promise<Scholar>{
    return new Promise(async (resolve)=>{
      let scholarData = await this.dbService.getAllStory(s.roninAddress);
      let story = scholarData
        .map((scholar) => {
          scholar.lastUpdate = new Date(scholar.lastUpdate).toDateString();
          return new Scholar(scholar)
        })
        .sort((a, b) => {
          return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
        })
      this.storyService.recalculateStory(story);
      const promiseArray: Promise<any>[] = [];
      story.forEach((day: Scholar)=>{
        promiseArray.push(this.storyService.updateStoryDay(day));
      });
      await Promise.all(promiseArray);
      resolve(story[story.length - 1]);
    })
  }
}
