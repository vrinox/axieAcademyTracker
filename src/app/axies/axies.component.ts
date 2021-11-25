import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { GetAxiesService } from '../services/getAxies/get-axies.service';
import { AxiesData } from '../models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { SessionsService } from '../services/sessions/sessions.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  myControl = new FormControl();
  partAxies = new FormControl();

  axiesRetry: Scholar[] = [];

  list: boolean = true;

  loading: boolean = true;

  valuePortafolio: boolean = false;

  filter: boolean = false;
  filterNameCtrl: boolean = false;

  namePlayerOptions: string[] = [];
  filteredOptions: Observable<string[]>;;

  cardsOptions: Observable<string[]>;
  parts: string[] = [];
  allParts: string[] = [];

  calculatePortafolio: boolean = true;

  @ViewChild('cards', { static: true }) Cards!: ElementRef<HTMLInputElement>;
  @ViewChildren('checks') ChecksboxType!: QueryList<MatCheckboxChange>;

  axiesData: AxiesData[] = [];

  typeAxies: string[] = ['Beast', 'Aquatic', 'Plant', 'Bird', 'Bug',
    'Reptile', 'Mech', 'Dawn', 'Dusk'];
  typeAxieTitle: string = 'Todos';

  breed: string[] = ['0', '1', '2', '3', '4', '5', '6'];

  breedTitle: string = 'Todos';

  donwloadPdf = false;

  viewMenuOptions: string[] = ['Basic Menu', 'Breed View', 'Completed View'];
  filterViewOptions: string[] = [];

  viewMenu: string = 'Basic Menu';
  movil: boolean = true;

  constructor(
    private getAxies: GetAxiesService,
    private sessions: SessionsService,
    public filterAxies: FiltersAxiesService,
    public portafolio: CalculatedPortafolioService
  ) {
    this.filteredOptions = new Observable();
    this.cardsOptions = new Observable();
  }

  ngOnInit(): void {
    this.filterAxies.copyAxiesData = [];
    this.start();

    this.cardsOptions = this.partAxies.valueChanges.pipe(
      startWith(''),
      map(value => this._filterParts(value))
    );


    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.selecViewMenu(this.viewMenu);

    this.setAllParts();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if(value != ''){
      this.filterNameCtrl = true;
    }else{
      this.filterNameCtrl = false;
    }
    return this.namePlayerOptions.filter(name => name.toLowerCase().includes(filterValue));
  }

  selectCheckType(type: MatCheckboxChange, index: number): void{
    if(this.ChecksboxType.toArray()[index].checked === false){
      this.typeAxieTitle = 'Todos';
    }else{
      this.ChecksboxType.toArray().forEach((checkbox, i: number) =>{
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
    this.startFilter()
  }

  private _filterParts(value: string): string[] {
    const filterValue = value.toLowerCase();
    if(value != ''){
      this.filterNameCtrl = true;
    }else{
      this.filterNameCtrl = false;
    }
    return this.allParts.filter(partName => partName.toLowerCase().includes(filterValue));
  }

  filterName(filterValue: string): void{
    this.axiesData = this.filterAxies.namePlayer(filterValue);
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
            this.filterAxies.addToCopy(DataAxie)
            if (!this.filterNameCtrl) {
              this.axiesData.push(DataAxie);
            }
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
      this.calculatePortafolio = false;
      this.sessions.oneScholar = [];
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

  setPart(partName: string){
    this.parts.push(partName);
    this.partAxies.setValue('');
  }

  startFilter(auction?: boolean): void {
    if (this.typeAxieTitle != 'Todos' || this.breedTitle != 'Todos' || this.parts.length != 0) {
      this.filter = true;
    };
    this.axiesData = this.filterAxies.get(this.typeAxieTitle, this.breedTitle, this.parts, auction);
  }

  async totalPortafolio(): Promise<void>{
    this.axiesData = await this.portafolio.getTotalPortafolio(this.axiesData, this.typeAxies);
    if(!this.filter){
      this.filterAxies.copyAxiesData = [... this.axiesData];
    }
    this.valuePortafolio = true;
  }

  async viewModule(): Promise<void>{
    if(!this.valuePortafolio){
      this.axiesData = await this.portafolio.getTotalPortafolio(this.axiesData, this.typeAxies);
    }
    this.list = false;
  }

  clearFilters(){
    this.typeAxieTitle = this.typeAxies[0];
    this.breedTitle = 'Todos';
    this.parts = [];
    this.myControl.setValue('');
    this.axiesData = [... this.filterAxies.copyAxiesData];
  }

  pdfDonwload(value: boolean){
    if(value){
      this.donwloadPdf = true
    }
  }

  savePdf(){
    this.sessions.setDonwloadPdf(true);
  }

  async refreshNa(){
    if(this.valuePortafolio){
      this.axiesData = await this.portafolio.getTotalPortafolio(this.axiesData, this.typeAxies);
    }
  }

  getNa(){
    this.axiesData = this.filterAxies.getNA(this.axiesData);
  }

  selecViewMenu(option: string){
    this.filterViewOptions = this.viewMenuOptions.filter(options => options != option);
    this.viewMenu = option;
    this.sessions.setMenuAxieView(option);
  }
  
}
