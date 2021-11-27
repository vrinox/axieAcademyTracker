import { Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { contentpdf, axiestypesPdf, AxiesData, PriceCryto } from 'src/app/models/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { GetPriceService } from '../services/getPriceCripto/get-price.service';
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
    totalNa: this.portafolio.total.na,
    totalEgg: 0,
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

  crytoPrice: PriceCryto = {
    axs: 0,
    etherium: 0,
    slp: 0
  }

  fecha: string = '';
  hora: string = '';

  displayedColumns: string[] = ['Tipo', 'Total', 'Valor Promedio', 'Valor Maximo', 'Valor Minimo', 'Usd', 'Eth'];

  dataSource: MatTableDataSource<axiestypesPdf> = new MatTableDataSource();

  @Input() axiesData: AxiesData[] = [];
  @ViewChild('screen', { static: true }) screen!: ElementRef;
  @Output() loadPdf = new EventEmitter<boolean>();

  constructor(
    private portafolio: CalculatedPortafolioService,
    private sessions: SessionsService,
    public comunity: ComunityService,
    private cryto: GetPriceService
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
      this.calculateEgg(axie)
    })
    this.parseContentPdf();
    this.getCrytoPrice();
    this.dateCurrent();
  }

  calculateAxiesType(axie: AxiesData): void{
    this.portafolio.typeAxies.forEach((type: string, index: number) =>{
      if(axie.class === type){
        this.contentpdf.axiesTypes[index].totalType += 1;
        this.contentpdf.axiesTypes[index].totalUsd += axie.price != 'N/A' ? parseFloat(axie.price!) : 0;
        this.contentpdf.axiesTypes[index].tototalEth += axie.eth != 'N/A' ? parseFloat(axie.eth!) : 0;
        this.compareMinMax(parseFloat(axie.price!), index);
        this.calculateAverage();
      }
    })
  }

  calculateEgg(axie: AxiesData){
    if(axie.class === null){
      this.contentpdf.totalEgg += 1; 
    }
  }

  compareMinMax(price: number, index: number): void{
    if(price > this.contentpdf.axiesTypes[index].maxValue){
      this.contentpdf.axiesTypes[index].maxValue = price;
    }else if(price < this.contentpdf.axiesTypes[index].minValue){
      this.contentpdf.axiesTypes[index].minValue = price;
    };
    if(this.contentpdf.axiesTypes[index].minValue === 0 && !isNaN(price)){
      this.contentpdf.axiesTypes[index].minValue = price;
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

  async getCrytoPrice(){
    this.crytoPrice.slp = await this.cryto.get('smooth-love-potion');
    this.crytoPrice.axs = await this.cryto.get('axie-infinity');
    this.crytoPrice.etherium = await this.cryto.get('ethereum');
  }

  dateCurrent(){
    let date = new Date();
    this.fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    this.hora = `${date.getHours()}:${date.getMinutes()}`;
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
