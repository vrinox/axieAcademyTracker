import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { GetAxiesService } from '../services/getAxies/get-axies.service';
import { AxiesData } from '../models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { SessionsService } from '../services/sessions/sessions.service';
import * as cards from '../../assets/json/cards.json';
import { FiltersAxiesService } from '../services/filtersAxies/filters-axies.service';
import { CalculatedPortafolioService } from '../services/calculatedPortafolio/calculated-portafolio.service';
import { MatCheckboxChange } from '@angular/material/checkbox'; 

@Component({
  selector: 'app-axies',
  templateUrl: './axies.component.html',
  styleUrls: ['./axies.component.sass']
})

export class AxiesComponent implements OnInit {
  axiesData: AxiesData[] = [];
  axiesRetry: Scholar[] = [];

  namePlayer: string = '';
  list: boolean = false;
  loading: boolean = true;

  filter: boolean = false;
  removable = true;

  namePlayerOptions: string[] = [];

  parts: string[] = [];
  allParts: string[] = [];

  valuePortafolio: boolean = false;
  calculatePortafolio: boolean = true;

  @ViewChild('cards', { static: true }) Cards!: ElementRef<HTMLInputElement>;
  @ViewChildren('checks') ChecksboxType!: QueryList<MatCheckboxChange>;
  @ViewChild('menuAxies') MenuAxies!: ElementRef;
  @ViewChild('btnRadioTodos', { static: true }) BtnRadioTodos!: any;

  typeAxies: string[] = ['Beast', 'Aquatic', 'Plant', 'Bird', 'Bug',
    'Reptile', 'Mech', 'Dawn', 'Dusk'];
  typeAxieTitle: string = 'Todos';

  breed: string[] = ['0', '1', '2', '3', '4', '5', '6'];

  breedTitle: string = 'Todos';

  donwloadPdf = false;

  viewMenuOptions: string[] = ['Basic Menu', 'Breed View', 'Completed View'];
  filterViewOptions: string[] = [];

  viewMenu: string = 'Basic Menu';
  movil: boolean = false;

  menuFilter: string = 'General';

  arrowFilter: boolean = true;

  funViewModule: boolean = false;


  orderTitle: string = 'Mayor Precio';
  orderMenu: boolean = false;
  priceOrId: boolean = true;
  order: string = 'Desc';

  sortMenu: boolean = false;

  constructor(
    private getAxies: GetAxiesService,
    private sessions: SessionsService,
    public filterAxies: FiltersAxiesService,
    public portafolio: CalculatedPortafolioService,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.filterAxies.copyAxiesData = [];
    this.movilChange();
    this.start();
    this.selecViewMenu(this.viewMenu);
    this.setAllParts();
  }

  filterName(filterValue: string): void{
    this.namePlayer = filterValue;
    if(!this.loading){
      this.axiesData = this.filterAxies.namePlayer(filterValue);
    };
  }

  movilChange(): void{
    if(window.innerWidth < 480){
      this.movil = true;
    }
  }

  setMenuFilterAxies(optionMenu: string): void{
    this.menuFilter = optionMenu;
  }

  remove(fruit: string): void {
    const index = this.parts.indexOf(fruit);
    if (index >= 0) {
      this.parts.splice(index, 1);
    }
    this.startFilter();
  }

  selectCheckType(type: MatCheckboxChange, index: number): void{
    let check: MatCheckboxChange[] = this.ChecksboxType.toArray();
    if(check[index].checked === false){
      this.typeAxieTitle = 'Todos';
    }else{
      check.forEach((checkbox, i: number) =>{
        if(i != index){
          checkbox.checked = false;
        }
      })
      this.typeAxieTitle = type.source.value;
    }
    this.startFilter();
  }

  selectRadioBreed(value: string): void{
    this.breedTitle = value;
    this.startFilter();
  }

  start(): void {
    if (this.sessions.oneScholar.length === 1) {
      this.getAxieData(this.sessions.oneScholar);
    } else {
      this.getAxieData(this.sessions.scholar);
    };
  };

  async getAxieData(scholars: Scholar[]){
    this.axiesRetry = [];
    await Promise.all(
      scholars.map((scholar: Scholar) => {
        this.namePlayerOptions.push(scholar.name);
        return this.getAxies.get(scholar).then((axies: AxiesData[]) => {
          axies.forEach((DataAxie: AxiesData) => {
            this.axiesData.push(DataAxie);
            if (this.filter) {
              this.startFilter();
            }
            return 
          });
        }).catch((scholar: Scholar) => {
          this.axiesRetry.push(scholar);
          return
        });
      })
    )
    if(this.axiesRetry.length === 0){
      this.loading = false;
      this.sessions.oneScholar = [];
      this.totalPortafolio();
    }else{
      this.getAxieData(this.axiesRetry);
    }
  }

  setAllParts(): void {
    Object.entries(cards).forEach((key: any) => {
      if (key[1].partName != undefined) {
        this.allParts.push(key[1].partName);
      }
    })
  }

  setPart(partName: string): void{
    this.sessions.setClear('parte');
    this.parts.push(partName);
    if(!this.loading){
      this.startFilter();
    }
  }

  startFilter(auction?: boolean): void {
    if (this.typeAxieTitle != 'Todos' || this.breedTitle != 'Todos' || this.parts.length != 0) {
      this.filter = true;
    };
    if(this.orderMenu){
      this.axiesData = this.filterAxies.get(this.typeAxieTitle, this.breedTitle, this.parts, auction);
    }
  }

  async totalPortafolio(): Promise<void>{
    await this.portafolio.getTotalPortafolio(this.axiesData, this.typeAxies);
    this.filterPrice();
    this.filterAxies.copyAxiesData = [... this.axiesData];
    this.orderMenu = true;
    this.calculatePortafolio = false;
    if(this.namePlayer !== ''){
      this.filterName(this.namePlayer)
    }else if(this.filter){
      this.startFilter();
    }
  }

  setOrderTitle(valueMenu: string, valuePriceOrId: boolean, valueOrder: string): void{
    this.orderTitle = valueMenu;
    this.priceOrId = valuePriceOrId;
    this.order = valueOrder;
    this.filterPrice();
  }

  filterPrice(): void{
    this.filterAxies.orderByPrice(this.axiesData, this.order, this.priceOrId);
  }

  async viewModule(): Promise<void>{
    this.list = false;
  }

  clearFilters(): void{
    this.namePlayer = '';
    this.typeAxieTitle = 'Todos';
    this.breedTitle = 'Todos';
    this.parts = [];
    this.sessions.setClear('name');
    this.sessions.setClear('parte');
    this.axiesData = [... this.filterAxies.copyAxiesData];
    this.filterPrice();
    this.BtnRadioTodos.checked = true;
    this.ChecksboxType.toArray().forEach(btnCheck=>{
      btnCheck.checked = false;
    });
  }

  pdfDonwload(value: boolean): void{
    if(value){
      this.donwloadPdf = true
    }
  }

  savePdf(){
    this.sessions.setDonwloadPdf(true);
  }

  async refreshNa(axie: AxiesData){
    this.filterAxies.setCopyAxiesNewPrice(axie);
    this.portafolio.refreshNaNewPrice(axie);
    this.startFilter();
    this.filterPrice();
  }

  getNa(){
    this.axiesData = this.filterAxies.getNA(this.axiesData);
  }

  selecViewMenu(option: string){
    this.filterViewOptions = this.viewMenuOptions.filter(options => options != option);
    this.viewMenu = option;
    this.sessions.setMenuAxieView(option);
  }

  menuFilterShow(): void{
    if(this.arrowFilter){
      this.renderer.setStyle(this.MenuAxies.nativeElement, 'display', 'block');
    }else{
      this.renderer.removeStyle(this.MenuAxies.nativeElement, 'display');
    }
    this.arrowFilter = !this.arrowFilter;
  } 
}