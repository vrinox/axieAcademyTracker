import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { GetAxiesService } from '../services/getAxies/get-axies.service';
import { AxiesData } from '../models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { SessionsService } from '../services/sessions/sessions.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import * as cards  from '../../assets/json/cards.json';
import { Axie } from '../models/axie';

@Component({
  selector: 'app-axies',
  templateUrl: './axies.component.html',
  styleUrls: ['./axies.component.sass']
})

export class AxiesComponent implements OnInit {
  myControl = new FormControl();
  partAxies = new FormControl();

  loading: boolean = true;

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
  
  @ViewChild('cards', { static: true }) Cards!: ElementRef<HTMLInputElement>;

  axiesData: AxiesData[] = [];
  copyAxiesData: AxiesData[] = [];

  typeAxies: string[] = ['Todos', 'Beast', 'Aquatic', 'Plant', 'Bird', 'Bug',
  'Reptile', 'Mech', 'Dawn', 'Dusk'];
  typeAxieTitle: string = this.typeAxies[0];

  breed: string[] = ['Todos', '0', '1', '2', '3', '4', '5', '6'];
  breedTitle: string = this.breed[0];

  constructor(
    private getAxies: GetAxiesService, 
    private sessions: SessionsService
    ) { 
      this.filteredOptions = new Observable();
      this.cardsOptions = new Observable();
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
        if(name == null){
          return this.allParts
        }else{
          return this._filterParts(name) 
        };
      }));
    
    this.setAllParts();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.filterName(filterValue);
    return this.namePlayerOptions.filter(name => name.toLowerCase().includes(filterValue));
  }

  async start(): Promise<void>{
    let scholars: Scholar[] = []
    if(this.sessions.oneScholar.length === 1){
      scholars = this.sessions.oneScholar;
    }else{
      scholars = this.sessions.scholar;
    };

    await Promise.all(
      scholars.map((scholar: Scholar)=>{
        this.namePlayerOptions.push(scholar.name);

        return this.getAxies.get(scholar.roninAddress, scholar.name).then((axies: AxiesData[])=>{
          axies.forEach((DataAxie: AxiesData)=>{
            this.axiesData.push(DataAxie);
            this.copyAxiesData.push(DataAxie);
            if(this.filter){
              this.startFilter();
            }
            if(this.filterNameCtrl){
              this.filterName(this.myControl.value);
            }
            return
          });
        });
      })
    )
    
    this.loading = false;

    this.sessions.oneScholar = [];
  };

  setAllParts(): void{
    Object.entries(cards).forEach((key: any)=>{
      if(key[1].partName != undefined){
        this.allParts.push(key[1].partName);
      }
    })
  }

  selecTypeAxie(type: string): void{
    this.typeAxieTitle = type;
  };

  selecBreed(breed: string): void{
    this.breedTitle = breed;
    this.startFilter();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.parts.push(value);
      this.startFilter();
    }

    // Clear the input value
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
    if(typeof(value) === 'string'){
      const filterValue = value.toLowerCase();
      
      return this.allParts.filter(name => name.toLowerCase().includes(filterValue));
    }else{
      return this.allParts
    }
  }

  startFilter(): void{
    if(this.typeAxieTitle != 'Todos' || this.breedTitle != 'Todos' || this.parts.length != 0){
      this.filter = true;
    }
    this.filterTypeAxies();
    this.filterBreed();
    this.filterParts();
  }

  filterName(value: string): void{
    console.log(value)
    if(value != ''){
      this.filterNameCtrl = true;
      this.axiesData =  this.copyAxiesData.filter(axie =>{
        return axie.name.toLowerCase().includes(value.toLowerCase());
      });
    }else{
      this.filterNameCtrl = false;
    }
  };

  private filterTypeAxies(): void{
    if(this.typeAxieTitle === 'Todos'){
      this.axiesData = [];
      this.axiesData = [... this.copyAxiesData];
    }else{
      this.axiesData = this.copyAxiesData.filter(axie => axie.axie.class === this.typeAxieTitle);
    }
  }

  private filterBreed(): void{
    if(this.breedTitle !== 'Todos'){
      console.log('entro breed');
      this.axiesData = this.axiesData.filter(axie => {
        return axie.axie.breedCount.toString().includes(this.breedTitle);
      });
    }
  }

  private filterParts(): void{
    if(this.parts.length !== 0){
      console.log('entro parts');
      let axies: AxiesData[] = [];

      this.axiesData.forEach(axie =>{
        if(this.hasPart(axie)){
          axies.push(axie);
        }
      });

      this.axiesData = [... axies];
    }
  }

  private hasPart(axie: AxiesData): boolean{
    return this.parts.some(part => this.hasPartsAxies(part, axie));
  }

  private hasPartsAxies(part: string, axie: AxiesData): boolean{
    return axie.parts.some(AxiePart => AxiePart.name === part)
  }
}
