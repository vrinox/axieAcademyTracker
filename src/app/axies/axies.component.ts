import { Component, OnInit } from '@angular/core';
import { GetAxiesService } from '../services/getAxies/get-axies.service';
import { AxiesData, SvgIconAxies, SvgIconParts } from '../models/interfaces';
import { ReferenceScholarsService } from '../services/referenceScholars/reference-scholars.service';
import { Scholar } from 'src/app/models/scholar';
import { svg } from '../models/svg-icons';


@Component({
  selector: 'app-axies',
  templateUrl: './axies.component.html',
  styleUrls: ['./axies.component.sass']
})
export class AxiesComponent implements OnInit {
  svgIcons: SvgIconAxies[] = svg.svgAxiesTypes;
  svgIconParts: SvgIconParts[] = svg.svgIconsParts;

  axiesData: AxiesData[] = []

  constructor(
    private getAxies: GetAxiesService, 
    private referenceScholar: ReferenceScholarsService
    ) { }

  ngOnInit(): void {
    this.start();
  }

  start(): void{
    // this.referenceScholar.scholar.forEach((scholar: Scholar)=>{
    //   this.getAxies.get(scholar.roninAddress).then((axies: AxiesData)=>{
    //     this.axiesData.push(axies);
    //   })
    // })
      this.getAxies.get('0xe4b5da6435d4641aff769e68b1496144a01fed6e', 'albino').then((axies: AxiesData)=>{
        console.log(axies);
        console.log(this.svgIconParts)
        this.axiesData.push(axies);
      })
  }

}
