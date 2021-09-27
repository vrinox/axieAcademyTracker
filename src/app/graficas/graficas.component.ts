import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { HistoricService } from '../services/historic/historic.service';
import { Scholar } from 'src/app/models/scholar';
import { historic } from '../models/historic';
import { HistoricData } from '../models/interfaces';
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

  formNameUser = this.formBuilder.group({
    nameScholar: new FormArray([])
  });

  dateStart = new FormControl();
  dateEnd = new FormControl();
  options: string[] = ['one', 'two', 'thress'];
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
    // this.filteredOptions = this.formNameUser.controls.input_1.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );
    this.addNewControlName();
    Object.keys(this.nameScholar.controls).forEach(e=>{
      
    })
  }

  get nameScholar(): FormArray{
    return this.formNameUser.get('nameScholar') as FormArray;
  }

  addNewControlName(){
    const lessonForm = this.formBuilder.group({
      inputScholar: new FormControl(''),
    });
    this.nameScholar.push(lessonForm);
  }

  openCloseMenu(close: number){
    this.dateHide = close;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  test(){
    console.log(this.formNameUser.controls.input_1.value);
  }

  private startHistoric(): void{
    let ronin_address: string = this.router.snapshot.params['roninAddress'];
    if(ronin_address === 'months'){

    }else{

    }
  }

  private createHistoric(
    historicData: HistoricData, 
    dataset: any = { 
      label: '',
      data: [], 
      borderColor: '#fff',
      fill: false,
      backgroundColor: '#fff', 
      borderWidth: 0 }): void{
    if(this.canvas.id != undefined){
      this.canvas.destroy();
    }
    this.canvas = new Chart(this.Ctx?.nativeElement, {
        type: 'line',
        data: {
            labels: historicData.slp,
            datasets: [{
                label: historicData.title,
                data: historicData.slp,
                fill: true,
                backgroundColor: '#c93131a6',
                borderColor: '#c93131',
                borderWidth: 1
                },
                dataset
                ]
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
