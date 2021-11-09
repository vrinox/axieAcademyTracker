import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { GetAxiesService } from '../services/getAxies/get-axies.service';
import { AxiesData } from '../models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { SessionsService } from '../services/sessions/sessions.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import * as cards from '../../assets/json/cards.json';
import { FiltersAxiesService } from '../services/filtersAxies/filters-axies.service';
import { CalculatedPortafolioService } from '../services/calculatedPortafolio/calculated-portafolio.service';

@Component({
  selector: 'app-axies',
  templateUrl: './axies.component.html',
  styleUrls: ['./axies.component.sass']
})

export class AxiesComponent implements OnInit, OnDestroy {
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

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  cardsOptions: Observable<string[]>;
  parts: string[] = [];
  allParts: string[] = [];

  calculatePortafolio: boolean = true;

  @ViewChild('cards', { static: true }) Cards!: ElementRef<HTMLInputElement>;

  axiesData: AxiesData[] = [];

  typeAxies: string[] = ['Todos', 'Beast', 'Aquatic', 'Plant', 'Bird', 'Bug',
    'Reptile', 'Mech', 'Dawn', 'Dusk'];
  typeAxieTitle: string = this.typeAxies[0];

  breed: string[] = ['Todos', '0', '1', '2', '3', '4', '5', '6'];
  breedTitle: string = this.breed[0];

  constructor(
    private getAxies: GetAxiesService,
    private sessions: SessionsService,
    public filterAxies: FiltersAxiesService,
    public portafolio: CalculatedPortafolioService
  ) {
    this.filteredOptions = new Observable();
    this.cardsOptions = new Observable();
  }
  ngOnDestroy(): void {
    
  }
  ngOnInit(): void {
    this.start();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.cardsOptions = this.partAxies.valueChanges.pipe(
      startWith(null),
      map((name: string | null) => {
        if (name == null) {
          return this.allParts
        } else {
          return this._filterParts(name)
        };
      }));

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

  filterName(filterValue: string){
    this.axiesData = this.filterAxies.namePlayer(filterValue);
  }

  start(): void {
    if (this.sessions.oneScholar.length === 1) {
      this.getAxieData(this.sessions.oneScholar)
    } else {
      this.getAxieData(this.sessions.scholar);
    };
  };

  async getAxieData(scholars: Scholar[]) {
    this.axiesRetry = [];
    await Promise.all(
      scholars.map((scholar: Scholar) => {
        this.namePlayerOptions.push(scholar.name);
        return this.getAxies.get(scholar).then((axies: AxiesData[]) => {
          axies.forEach((DataAxie: AxiesData) => {
            this.filterAxies.addToCopy(DataAxie,'getAxieData')
            if (!this.filterNameCtrl) {
              this.axiesData.push(DataAxie);
            }
            if (this.filter) {
              this.startFilter();
            }
            return 
          });
        }).catch((scholar: Scholar) => {
          console.log(scholar)
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

  selecTypeAxie(type: string): void {
    this.typeAxieTitle = type;
  };

  selecBreed(breed: string): void {
    this.breedTitle = breed;
    this.startFilter();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.parts.push(value);
      this.startFilter();
    }
    event.chipInput!.clear();

    this.partAxies.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.parts.indexOf(fruit);

    if (index >= 0) {
      this.parts.splice(index, 1);
    }
    this.startFilter();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.parts.push(event.option.viewValue);
    this.Cards.nativeElement.value = '';
    this.partAxies.setValue(null);
    this.startFilter();
  }

  private _filterParts(value: string): string[] {
    if (typeof (value) === 'string') {
      const filterValue = value.toLowerCase();

      return this.allParts.filter(name => name.toLowerCase().includes(filterValue));
    } else {
      return this.allParts
    }
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
    this.breedTitle = this.breed[0];
    this.parts = [];
    this.myControl.setValue('');
    this.axiesData = [... this.filterAxies.copyAxiesData];
  }
}
