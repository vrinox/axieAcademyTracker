import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

@Component({
  selector: 'app-axies',
  templateUrl: './axies.component.html',
  styleUrls: ['./axies.component.sass']
})
export class AxiesComponent implements OnInit {

  myControl = new FormControl();
  namePlayerOptions: string[] = [];
  filteredOptions: Observable<string[]>;;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  partAxies = new FormControl();
  filteredPartsOptions: Observable<string[]>;
  parts: string[] = [];
  allParts: string[] = [];
  
  @ViewChild('fruitInput', { static: true }) fruitInput!: ElementRef<HTMLInputElement>;

  axiesData: AxiesData[] = [];

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
      this.filteredPartsOptions = new Observable();
    }

  ngOnInit(): void {
    this.start();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filteredPartsOptions = this.partAxies.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filterParts(fruit) : this.allParts.slice())
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.namePlayerOptions.filter(name => name.toLowerCase().includes(filterValue));
  }

  start(): void{
    let scholars: Scholar[] = []
    if(this.sessions.oneScholar.length === 1){
      scholars = this.sessions.oneScholar;
    }else{
      scholars = this.sessions.scholar;
    };
    scholars.forEach((scholar: Scholar)=>{
      this.namePlayerOptions.push(scholar.name);

      this.getAxies.get(scholar.roninAddress, scholar.name).then((axies: AxiesData[])=>{
        axies.forEach((axiesData: AxiesData)=>{
          this.axiesData.push(axiesData)
          this.setAllParts(axiesData)
        });
      });

    });
    this.sessions.oneScholar = [];
  };

  setAllParts(axiesData: AxiesData): void{
    
  }

  selecTypeAxie(type: string): void{
    this.typeAxieTitle = type;
  };

  selecBreed(breed: string): void{
    this.breedTitle = breed;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.parts.push(value);
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
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.parts.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.partAxies.setValue(null);
  }

  private _filterParts(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allParts.filter(parts => parts.toLowerCase().includes(filterValue));
  }
}
