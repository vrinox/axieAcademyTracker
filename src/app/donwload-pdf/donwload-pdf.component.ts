import { Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { contentpdf, axiestypesPdf, AxiesData } from 'src/app/models/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { CalculatedPortafolioService } from '../services/calculatedPortafolio/calculated-portafolio.service';
import { SessionsService } from '../services/sessions/sessions.service';
import { ComunityService } from '../services/community.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-donwload-pdf',
  templateUrl: './donwload-pdf.component.html',
  styleUrls: ['./donwload-pdf.component.sass']
})
export class DonwloadPdfComponent implements OnInit {

  contentpdf: contentpdf = {
    totalAxie: this.portafolio.total.axies,
    totalPortafolio: this.portafolio.total.usd,
    totalbecados: this.portafolio.total.becados,
    totalPortafolioEth: this.portafolio.total.eth,
    axiesTypes: [
    { type: 'Beast', averageValue: 0, maxValue: 0, minValue: 0, totalUsd: 0, totalType: 0, tototalEth: 0 },
    { type: 'Aquatic', averageValue: 0, maxValue: 0, minValue: 0, totalUsd: 0, totalType: 0, tototalEth: 0 },  
    { type: 'Plant', averageValue: 0, maxValue: 0, minValue: 0, totalUsd: 0, totalType: 0, tototalEth: 0 },
    { type: 'Bird', averageValue: 0, maxValue: 0, minValue: 0, totalUsd: 0, totalType: 0, tototalEth: 0 },
    { type: 'Bug', averageValue: 0, maxValue: 0, minValue: 0, totalUsd: 0, totalType: 0, tototalEth: 0 },  
    { type: 'Reptile', averageValue: 0, maxValue: 0, minValue: 0, totalUsd: 0, totalType: 0, tototalEth: 0 },
    { type: 'Mech', averageValue: 0, maxValue: 0, minValue: 0, totalUsd: 0, totalType: 0, tototalEth: 0 },
    { type: 'Dawn', averageValue: 0, maxValue: 0, minValue: 0, totalUsd: 0, totalType: 0, tototalEth: 0 },  
    { type: 'Dusk', averageValue: 0, maxValue: 0, minValue: 0, totalUsd: 0, totalType: 0, tototalEth: 0 }]
  }

  displayedColumns: string[] = ['Tipo', 'Total', 'Valor Promedio', 'Valor Maximo', 'Valor Minimo', 'Usd', 'Eth'];

  dataSource: MatTableDataSource<axiestypesPdf> = new MatTableDataSource();

  @Input() axiesData: AxiesData[] = [];
  @ViewChild('screen', { static: true }) screen!: ElementRef;
  @Output() loadPdf = new EventEmitter<boolean>();

  constructor(
    private portafolio: CalculatedPortafolioService,
    private sessions: SessionsService,
    public comunity: ComunityService
  ) { }
  
  ngOnInit(): void {
    this.travelInAxiesData();
    this.dataSource = new MatTableDataSource(this.contentpdf.axiesTypes);
    this.loadPdf.emit(true);
    this.sessions.getDonwloadPdf().subscribe((value: boolean) =>{
      if(value = true){
        this.donwloadPdf();
      }
    })
  }

  travelInAxiesData(): void{
    this.axiesData.forEach(axie=>{
      this.calculateAxiesType(axie);
    })
    this.parseContentPdf();
  }

  calculateAxiesType(axie: AxiesData): void{
    this.portafolio.typeAxies.forEach((type: string, index: number) =>{
      if(axie.class === type){
        this.contentpdf.axiesTypes[index - 1].totalType += 1;
        this.contentpdf.axiesTypes[index - 1].totalUsd += axie.price != 'N/A' ? parseFloat(axie.price!) : 0;
        this.contentpdf.axiesTypes[index - 1].tototalEth += axie.eth != 'N/A' ? parseFloat(axie.eth!) : 0;
        this.compareMinMax(parseFloat(axie.price!), index);
        this.calculateAverage();
      }
    })
  }

  compareMinMax(price: number, index: number): void{
    if(price > this.contentpdf.axiesTypes[index - 1].maxValue){
      this.contentpdf.axiesTypes[index - 1].maxValue = price;
    }else if(price < this.contentpdf.axiesTypes[index - 1].minValue){
      this.contentpdf.axiesTypes[index - 1].minValue = price;
    };
    if(this.contentpdf.axiesTypes[index - 1].minValue === 0 && !isNaN(price)){
      this.contentpdf.axiesTypes[index - 1].minValue = price;
    }
  }

  calculateAverage(): void{
    this.contentpdf.axiesTypes.forEach(type=>{
      if(type.totalType != 0){
        type.averageValue = type.totalUsd / type.totalType;
      };
    })
  }

  parseContentPdf(){
    this.contentpdf.axiesTypes.forEach(type=>{
      type.averageValue = parseFloat(type.averageValue.toFixed(2))
      type.maxValue = parseFloat(type.maxValue.toFixed(2))
      type.minValue = parseFloat(type.minValue.toFixed(2))
      type.totalUsd = parseFloat(type.totalUsd.toFixed(2))
      type.tototalEth = parseFloat(type.tototalEth.toFixed(2))
    })
  }

  donwloadPdf(): void{
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
      onclone: function (clonedDoc: any) {
        clonedDoc.getElementById('pdf').style.display = 'block';
      }
    };
    html2canvas(this.screen?.nativeElement, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');

      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    });
  }

}
