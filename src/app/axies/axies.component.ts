import { Component, OnInit } from '@angular/core';
import { GetAxiesService } from '../services/getAxies/get-axies.service';
import { AxiesData } from '../models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { SessionsService } from '../services/sessions/sessions.service';

@Component({
  selector: 'app-axies',
  templateUrl: './axies.component.html',
  styleUrls: ['./axies.component.sass']
})
export class AxiesComponent implements OnInit {

  axiesData: AxiesData[] = [];

  constructor(
    private getAxies: GetAxiesService, 
    private sessions: SessionsService
    ) { }

  ngOnInit(): void {
    this.start();
  }

  start(): void{
    let scholars: Scholar[] = []
    if(this.sessions.oneScholar.length === 1){
      scholars = this.sessions.oneScholar;
    }else{
      scholars = this.sessions.scholar;
    };
    scholars.forEach((scholar: Scholar)=>{
      this.getAxies.get(scholar.roninAddress, scholar.name).then((axies: AxiesData[])=>{
        axies.forEach((axiesData: AxiesData)=>{
          this.axiesData.push(axiesData)
        });
      });
    });
    this.sessions.oneScholar = [];
  };

}
