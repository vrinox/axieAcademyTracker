import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { HistoricService } from '../services/historic/historic.service';
import { Scholar } from 'src/app/models/scholar';
import { historic } from '../models/historic';
import { HistoricData, Dataset } from '../models/interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import Chart from 'chart.js/auto';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';;
import { map, startWith } from 'rxjs/operators';
import { ReferenceScholarsService } from '../services/referenceScholars/reference-scholars.service';


@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.sass']
})
export class GraficasComponent implements OnInit {
  @ViewChild('ctx', { static: true }) Ctx?: ElementRef;
  @ViewChildren('inputUser') InputUser!: QueryList<ElementRef>

  canvas: any = [];

  formNameUser: FormGroup = this.formBuilder.group({
    nameScholar: new FormArray([this.createControlName()])
  });

  dateStart = new FormControl();
  dateEnd = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  dateHide: number = 2;

  addInput: boolean = false;

  constructor(
    private historic: HistoricService,
    private router: ActivatedRoute,
    private referenceScholars:  ReferenceScholarsService,
    private formBuilder: FormBuilder
    ) { 
      this.filteredOptions = new Observable();
    }

  ngOnInit(): void {
    this.referenceScholars.scholar.forEach((scholar: Scholar, index)=>{
      this.options.push(`${index + 1}-${scholar.name}`)
    });
    this.startHistoric();
  }

  private startHistoric(): void{
    let ronin_address: string = this.router.snapshot.params['roninAddress'];
    if(ronin_address === 'months' || ronin_address === ''){
      let dateOne: Date = new Date(new Date().getFullYear(), new Date().getMonth());
      let datetwo: Date = new Date(dateOne.getFullYear(), dateOne.getMonth() + 1);
      this.createHistoricMont(dateOne, datetwo);
    }else{
      const ronin: string[] = [ronin_address];
      this.createHistoricPlayer(ronin);
    }
  }

  get nameScholar(): FormArray{
    return <FormArray> this.formNameUser.get('nameScholar');
  }

  createControlName():FormGroup {
    return this.formBuilder.group({
      inputScholar: new FormControl(''),
    });
  }

  addNewControlName(): void{
    this.nameScholar.push(this.createControlName());
  }

  removeControlName(index: number): void{
    this.nameScholar.controls.splice(index, 1);
  }

  openCloseMenu(close: number): void{
    this.dateHide = close;
  }

  filterOpntions(i: number): void{
    this.filteredOptions = this.nameScholar.controls[i].get('inputScholar')!.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  hictoricMultPlayers(): void{
    let ronin: string[] = []
    this.nameScholar.controls.forEach(positionScholar =>{
      const position: number = parseInt(positionScholar.get('inputScholar')!.value) - 1;
      ronin.push(this.referenceScholars.scholar[position].roninAddress);
    });
    this.createHistoricPlayer(ronin);
  }

  historicMonth(): void{
    this.createHistoricMont(this.dateStart.value, this.dateEnd.value);
  }

  createHistoricPlayer(ronin: string[]): void{
    this.historic.getHistoricPlayer(ronin).then((scholars: Scholar[])=>{
      this.createHistoric(historic.getHistoricPlayer(scholars, ronin));
    });
  }

  createHistoricMont(dateOne: Date, datetwo: Date):void{
    this.historic.getMontHistoric(dateOne, datetwo).then((scholar: Scholar[])=>{
      this.createHistoric(historic.getMontHistoric(scholar, dateOne, datetwo));
    })
  }


  private createHistoric(historicData: HistoricData): void{
    if(this.canvas.id != undefined){
      this.canvas.destroy();
    }

    this.canvas = new Chart(this.Ctx?.nativeElement, {
      type: 'line',
      data: {
        labels: historicData.labelSlp,
        datasets: historicData.dataset
      },
      options: {
        maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
            y1: {
              beginAtZero: true,
            }
          }
      }
    });
  }
}
