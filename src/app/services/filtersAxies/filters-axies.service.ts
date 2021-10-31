import { Injectable } from '@angular/core';
import { AxiesData } from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FiltersAxiesService {
  private axiesData: AxiesData[] = []
  copyAxiesData: AxiesData[] = [];

  constructor() { }

  get(typeAxieTitle: string, breedTitle: string, parts: string[], auction?: boolean): AxiesData[]{
    this.filterTypeAxies(typeAxieTitle);
    this.filterBreed(breedTitle);
    this.filterParts(parts);
    if(auction){
      this.filterAuction();
    }
    return this.axiesData
  }

  namePlayer(value: string): AxiesData[]{
    if (value != '') {
      return this.copyAxiesData.filter(axie => {
        return axie.namePlayer.toLowerCase().includes(value.toLowerCase());
      });
    } else {
      return this.copyAxiesData
    }
  };

  private filterTypeAxies(typeAxieTitle: string): void {
    if (typeAxieTitle === 'Todos') {
      this.axiesData = [];
      this.axiesData = [... this.copyAxiesData];
    } else {
      this.axiesData = this.copyAxiesData.filter(axie => axie.class === typeAxieTitle);
    }
  }

  private filterBreed(breedTitle: string): void {
    if (breedTitle !== 'Todos') {
      this.axiesData = this.axiesData.filter(axie => {
        return axie.breedCount.toString().includes(breedTitle);
      });
    }
  }

  private filterParts(parts: string[]): void {
    if (parts.length !== 0) {
      let axies: AxiesData[] = [];

      this.axiesData.forEach(axie => {
        if (this.hasPart(axie, parts)) {
          axies.push(axie);
        }
      });

      this.axiesData = [...axies];
    }
  }

  private hasPart(axie: AxiesData, parts: string[]): boolean {
    return parts.some(part => this.hasPartsAxies(part, axie));
  }

  private hasPartsAxies(part: string, axie: AxiesData): boolean {
    return axie.parts.some(AxiePart => AxiePart.name === part)
  }

  private filterAuction(): void{
    this.axiesData = this.copyAxiesData.filter(axie => {
      return axie.auction
    });
  }

  getNA(axies: AxiesData[]): void{
    axies = this.copyAxiesData.filter(axie => {
      return axie.price === 'N/A';
    });
  }
}
