import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HistoricService } from '../services/historic/historic.service';
import { Scholar } from 'src/app/models/scholar';
import { historic } from '../models/historic';
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
    this.getHistoricOneScholar();
  }


  getHistoricOneScholar(): void{
    this.historic.getHistoric('0x83bfdf005a1979b6342a3df537024065e97f153c')
    .then((scholar: Scholar[])=>{
      const historicData = historic.getDataOneScholarHisctoric(scholar);
      this.createHistoric(historicData.dias, historicData.slp, historicData.title);
    })
  }

  createHistoric(dias: number[], slp: number[], title: string): void{
    this.prueba = new Chart(this.Ctx?.nativeElement, {
        type: 'line',
        data: {
            labels: dias,
            datasets: [{
                label: title,
                data: slp,
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 1
                }
                ]
        },
        options: {
            scales: {
                y: {
                  type: 'linear',
                  beginAtZero: true,
                  display: false
                }
            }
        }
    });
  }
}
