import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AxieGene } from 'agp-npm/dist/axie-gene';
import { Genes } from 'src/app/models/interfaces';

@Component({
  selector: 'app-genes',
  templateUrl: './genes.component.html',
  styleUrls: ['./genes.component.sass']
})
export class GenesComponent implements OnInit {

  @Input() AxieGen: string = '';
  @Input() viewChange: boolean = false;
  @Output() puress = new EventEmitter<number>();

  axieGenes: any = '';
  genes: Genes[] = [];
  part: string[] = ['eyes', 'ears', 'back', 'horn', 'mouth', 'tail'];

  constructor() {}

  ngOnInit(): void {
    this.axieGenes = new AxieGene(this.AxieGen);
    this.parseGenes();
    this.uperCaseGenes();
    this.puressSend();
  }

  parseGenes(){
    Object.entries(this.axieGenes.genes).forEach((key: any) =>{
      if(this.part.includes(key[0])){
        let gen: Genes = {
          d: {
            class: key[1].d.cls,
            type: key[1].d.type,
            partName: key[1].d.name
          },
          r1: {
            class: key[1].r1.cls,
            type: key[1].r1.type,
            partName: key[1].r1.name
          },
          r2: {
            class: key[1].r2.cls,
            type: key[1].r2.type,
            partName: key[1].r2.name
          }
        }
        this.genes.push(gen);
      }
    })
  }

  uperCaseGenes(){
    this.genes.map(gen=>{
      gen.d.class =  gen.d.class.slice(0,1).toLocaleUpperCase() + gen.d.class.slice(1);
      gen.d.type = gen.d.type.slice(0,1).toLocaleUpperCase() + gen.d.type.slice(1);
    })
  }

  puressSend(){
    this.puress.emit(this.axieGenes.getGeneQuality());
  }
}
