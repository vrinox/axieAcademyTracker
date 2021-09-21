import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HistoricService } from '../services/historic/historic.service';
import { Scholar } from 'src/app/models/scholar';
import { historic } from '../models/historic';
import { HistoricData } from '../models/interfaces';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.sass']
})
export class GraficasComponent implements OnInit {
  @ViewChild('ctx', { static: true }) Ctx?: ElementRef;
  prueba: any = [];
  constructor(private historic: HistoricService) { }

  ngOnInit(): void {
    this.compareScholarHistoric();
  }


  getHistoricOneScholar(): void{
    this.historic.getHistoric('0x612450e46a7db01d1b9eafb30c2f5c992e259a2d')
    .then((scholar: Scholar[])=>{
      const historicData = historic.getDataOneScholarHisctoric(scholar);
      this.createHistoric(historicData);
    })
  }

  getTwoMontScholars(): void{
    let first: Date = new Date('Sep 01 2021')
    let last: Date = new Date('Sep 30 2021')
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
      let test = {
          label: historicData.historic?.title,
          data: historicData.historic?.slp,
          fill: true,
          backgroundColor: '#3431c9a6',
          borderColor: '#3431c9',
          borderWidth: 1
        }
      this.createHistoric(historicData, test);
    })
  }


  createHistoric(historicData: HistoricData, test: any = {}): void{
    this.prueba = new Chart(this.Ctx?.nativeElement, {
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
                test
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
