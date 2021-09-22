import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HistoricService } from '../services/historic/historic.service';
import { Scholar } from 'src/app/models/scholar';
import { historic } from '../models/historic';
import { HistoricData } from '../models/interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.sass']
})
export class GraficasComponent implements OnInit {
  @ViewChild('ctx', { static: true }) Ctx?: ElementRef;
  canvas: any = [];
  constructor(
    private historic: HistoricService,
    private router: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.startHistoric();
  }

  startHistoric(): void{
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
  }

  getMontScholars(): void{
    let first: Date = new Date(new Date().getFullYear(), new Date().getMonth());
    let last: Date = new Date(first.getFullYear(), first.getMonth() + 1, first.getDate());
    this.historic.getMontHistoric(first, last).then((scholar: Scholar[])=>{
      console.log(scholar[0].todaySLP);
      const historicData: HistoricData = historic.getTwoMonthHistoric(scholar, first, last);
      this.createHistoric(historicData);
    });
  }

  compareScholarHistoric(): void{
    this.historic.getTowScholars('0x6c8aa348e82fba2ef7514ab28c000f7cd4abcc95', '0x83bfdf005a1979b6342a3df537024065e97f153c')
    .then((scholar: Scholar[])=>{
      const historicData: HistoricData =  historic.compareTwoScholar(scholar, '0x6c8aa348e82fba2ef7514ab28c000f7cd4abcc95')
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
  }


  createHistoric(
    historicData: HistoricData, 
    dataset: any = { label: '',data: [], 
    backgroundColor: '#dedede', 
    borderColor: '#dedede' }): void{

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
