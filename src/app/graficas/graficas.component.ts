import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HistoricService } from '../services/historic/historic.service';
import { Scholar } from 'src/app/models/scholar';
import { historic } from '../models/historic';
import { HistoricData } from '../models/interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import Chart from 'chart.js/auto';
import { FormControl } from '@angular/forms';
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
  canvas: any = [];
  myControl = new FormControl();
  myControl2 = new FormControl();
  dateStart = new FormControl();
  dateEnd = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  filteredOptions2: Observable<string[]>;
  dateHide: number = 2;

  addInput: boolean = false;

  constructor(
    private historic: HistoricService,
    private router: ActivatedRoute,
    private referenceScholars:  ReferenceScholarsService
    ) { 
      this.filteredOptions = new Observable();
      this.filteredOptions2 = new Observable();
    }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => this._filter(value))
    );
    this.filteredOptions2 = this.myControl2.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => this._filter(value))
    );

    this.startHistoric();
    this.getScholars();
  }

  openCloseMenu(close: number){
    this.dateHide = close;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private getScholars(){
    this.referenceScholars.scholar.forEach((scholar: Scholar, index) => {
      this.options.push(`${index + 1 }- ${scholar.name}`);
    });
  }

  private startHistoric(): void{
    let ronin_address: string = this.router.snapshot.params['roninAddress'];
    if(ronin_address === 'months'){
      this.getMontScholars();
    }else{
      this.getHistoricOneScholar(ronin_address);
    }
  }

  getHistoricOneScholar(roninAddress: string): void{
    this.historic.getHistoric(roninAddress)
    .then((scholar: Scholar[])=>{
      const historicData = historic.getDataOneScholarHisctoric(scholar);
      this.createHistoric(historicData);
    })
    this.myControl.setValue('');
    this.myControl2.setValue('');
  }

  getMontScholars(): void{
    let first: Date = new Date(new Date().getFullYear(), new Date().getMonth());
    let last: Date = new Date(first.getFullYear(), first.getMonth() + 1, first.getDate());
    if(this.dateStart.value != null && this.dateEnd.value != null){
      first = this.dateStart.value;
      last = this.dateEnd.value;
    }
    this.historic.getMontHistoric(first, last).then((scholar: Scholar[])=>{
      const historicData: HistoricData = historic.getTwoMonthHistoric(scholar, first, last);
      this.createHistoric(historicData);
    });
    this.dateStart.setValue('');
    this.dateEnd.setValue('');
  }

  compareScholarHistoric(): void{
    if(this.myControl.value != null && this.myControl2.value != null){
      this.historic.getTowScholars(this.referenceScholars.scholar[parseInt(this.myControl.value) - 1].roninAddress, 
      this.referenceScholars.scholar[parseInt(this.myControl2.value) - 1 ].roninAddress)
      .then((scholar: Scholar[])=>{
        const historicData: HistoricData =  historic.compareTwoScholar(scholar, scholar[0].roninAddress);
        let dataset = {
            label: historicData.historic?.title,
            data: historicData.historic?.slp,
            fill: true,
            backgroundColor: '#3431c9a6',
            borderColor: '#3431c9',
            borderWidth: 1
        }
        this.createHistoric(historicData, dataset);
      })
    }else if(this.myControl.value != null){
      this.getHistoricOneScholar(this.referenceScholars.scholar[parseInt(this.myControl.value)-1].roninAddress)
    }else if(this.myControl2.value != null){
      this.getHistoricOneScholar(this.referenceScholars.scholar[parseInt(this.myControl.value)-1].roninAddress)
    }
    this.myControl.setValue('');
    this.myControl2.setValue('');
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
