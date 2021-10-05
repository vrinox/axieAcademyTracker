import { Component, OnInit } from '@angular/core';
import { GetAxiesService } from '../services/getAxies/get-axies.service';
import { AxiesData } from '../models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-axies',
  templateUrl: './axies.component.html',
  styleUrls: ['./axies.component.sass']
})
export class AxiesComponent implements OnInit {

  axiesData: AxiesData[] = [];

  constructor(
    private getAxies: GetAxiesService, 
    private router: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.start();
  }

  start(): void{
      this.getAxies.get('0xe4b5da6435d4641aff769e68b1496144a01fed6e', 'albino').then((axies: AxiesData)=>{
        this.axiesData.push(axies)
      })
  }

}
