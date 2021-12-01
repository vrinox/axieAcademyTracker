import { Injectable } from '@angular/core';
import { AxiesData } from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FiltersAxiesService {
  private dataAxies: AxiesData[] = []
  copyAxiesData: AxiesData[] = [];

  constructor() { }

  get(typeAxieTitle: string, breedTitle: string, parts: string[], auction?: boolean): AxiesData[]{
    this.filterTypeAxies(typeAxieTitle);
    this.filterBreed(breedTitle);
    this.filterParts(parts);
    if(auction){
      this.filterAuction();
    }
    return this.dataAxies
  }

  namePlayer(value: string): AxiesData[]{
    if (value != '') {
      return this.copyAxiesData.filter(axie => {
        return axie.namePlayer.toLowerCase().includes(value.toLowerCase());
      });
    } else {
      return [ ...this.copyAxiesData];
    }
  };

  private filterTypeAxies(typeAxieTitle: string): void {
    if (typeAxieTitle === 'Todos') {
      this.dataAxies = [];
      this.dataAxies = [... this.copyAxiesData];
    } else {
      this.dataAxies = this.copyAxiesData.filter(axie => axie.class === typeAxieTitle);
    }
  }

  private filterBreed(breedTitle: string): void {
    if (breedTitle !== 'Todos') {
      this.dataAxies = this.dataAxies.filter(axie => {
        return axie.breedCount.toString().includes(breedTitle);
      });
    }
  }

  private filterParts(parts: string[]): void {
    if (parts.length !== 0) {
      let axies: AxiesData[] = [];

      this.dataAxies.forEach(axie => {
        if (this.hasPart(axie, parts)) {
          axies.push(axie);
        }
      });

      this.dataAxies = [...axies];
    }
  }

  private hasPart(axie: AxiesData, parts: string[]): boolean {
    return parts.some(part => this.hasPartsAxies(part, axie));
  }

  private hasPartsAxies(part: string, axie: AxiesData): boolean {
    return axie.parts.some(AxiePart => AxiePart.name === part)
  }

  private filterAuction(): void{
    this.dataAxies = this.copyAxiesData.filter(axie => {
      return axie.auction
    });
  }

  getNA(axies: AxiesData[]): AxiesData[]{
    return axies = this.copyAxiesData.filter(axie => {
      return axie.price === 'N/A';
    });
  }

  orderByPrice(axies: AxiesData[], order: string, priceOrId: boolean): AxiesData[]{
    return axies.sort((a, b) => {
      let filterA: number = 0;
      let filterB: number = 0;
      if(priceOrId){
        if(a.price !== 'N/A'){
          filterA = parseFloat(a.price!);
        }
      }else{
        filterA = parseInt(a.id);
      }
      if(priceOrId){
        if(b.price !== 'N/A'){
          filterB = parseFloat(b.price!);
        }
      }else{
        filterB = parseInt(b.id);
      }

      if(order === 'Desc'){
        return filterB - filterA;
      }else{
        return filterA - filterB;
      }
    });
  }

  setCopyAxiesNewPrice(axie: AxiesData): void{
    this.copyAxiesData.forEach(axies => {
      if(axies.id === axies.id){
        axies.price = axie.price;
        axies.eth = axie.eth;
      };
    });
  }
}
