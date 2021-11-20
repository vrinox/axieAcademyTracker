import { Component, Input, OnInit } from '@angular/core';
import { AxieGene } from 'agp-npm/dist/axie-gene';

@Component({
  selector: 'app-genes',
  templateUrl: './genes.component.html',
  styleUrls: ['./genes.component.sass']
})
export class GenesComponent implements OnInit {

  @Input() AxieGen: string = '';
  axieGenes: any = '';

  constructor() {}

  ngOnInit(): void {
    this.axieGenes = new AxieGene(this.AxieGen);
    console.log(this.axieGenes);
  }

  parseUpercase(axie: AxieGene, part: string){
    
  }



}
