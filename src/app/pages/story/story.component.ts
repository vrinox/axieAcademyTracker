import { Component, OnInit, ViewChild } from '@angular/core';
import { Scholar } from '../../models/scholar';
import { DatabaseService } from '../../services/database/database.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ComunityService } from '../../services/community.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.sass']
})
export class StoryComponent implements OnInit {
  disponibleScholars: Scholar[] = [];
  myControl = new FormControl();
  namePlayerOptions: string[] = [];  
  filteredOptions: Observable<string[]>;;
  scholars: Scholar[] = [];
  scholars$: Subject<Scholar[]> = new Subject();
  displayedColumns: string[] = ['lastUpdate', 'totalSLP', 'todaySLP', 'yesterdaySLP', 'monthSLP', 'monthlyRank', 'MMR'];
  @ViewChild(MatSort, { static: false }) sort?: MatSort;
  dataSource: MatTableDataSource<Scholar> = new MatTableDataSource();
  scholarStory: any[] = [];
  constructor(    
    private dbService: DatabaseService,
    private communityService: ComunityService
  ) { 
    this.filteredOptions = new Observable();
  }

  async ngOnInit() {
    const memberAddressList = await this.communityService.getMembersAddressList(this.communityService.activeCommunity.id);
    this.disponibleScholars = await this.dbService.getScholarsByAddressList(memberAddressList);
    this.disponibleScholars.forEach((scholar: Scholar)=>{
      this.namePlayerOptions.push(scholar.name);
    });
    
  }
  async cargarDatos(roninAddress: string) {
    let scholarData = await this.dbService.getAllStory(roninAddress);
    let scholarsFirebase = scholarData
    .map((scholar)=>{
      scholar.lastUpdate = new Date(scholar.lastUpdate).toDateString();
      return new Scholar(scholar)
    })
    .sort((a,b)=>{
      return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
    })
    .slice(0, 15);
    this.scholars = scholarsFirebase;
    this.dataSource = new MatTableDataSource(this.scholars);
    this.dataSource.sort = this.sort!;
    this.scholarStory = scholarsFirebase
    .sort((a,b)=>{
      return new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime();
    })
    .map((scholar: Scholar) => {
      return {
        label: scholar.lastUpdate,
        value: scholar.todaySLP
      }
    });
  }
  public buscar(){
    const name = this.myControl.value;
    const scholar = this.disponibleScholars.find((requestedScholar:Scholar)=>{
      return requestedScholar.name === name;
    });
    if(scholar){
        this.cargarDatos(scholar.roninAddress);
    }
  }
  
  calcularRankMensual() {
    let rank = 1;
    this.dataSource.data = this.dataSource.data.sort((a:Scholar, b:Scholar)=>{
      return b.monthSLP -a.monthSLP;
    }).map((scholar:Scholar)=>{
      scholar.mounthlyRank = rank;
      rank++;
      return scholar;
    });
  }
  

}
