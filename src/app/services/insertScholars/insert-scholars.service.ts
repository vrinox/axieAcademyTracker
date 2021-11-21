import { Injectable } from '@angular/core';
import { DatosFormulario, scholarOfficialData } from 'src/app/models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { ComunityService } from '../community.service';
import { DatabaseService } from '../database/database.service';
import { ScholarDataService } from '../scholarData/scholar-data.service';

@Injectable({
  providedIn: 'root'
})

export class InsertScholarsService {
  constructor(
    private dbService: DatabaseService,   
    private schDataService: ScholarDataService,
    private communiyService: ComunityService
  ) { }

  insertNewScholar(newScholar: DatosFormulario): Promise<Scholar> {
    const parsedRonin = this.parseRonin(newScholar.roninAddress);    
    return new Promise(async (resolve) => {
      let parsedScholar = await this.dbService.getScholar('roninAddress',newScholar.roninAddress);
      if(parsedScholar.roninAddress !== ''){
        let scholarsUpdated: scholarOfficialData = await this.schDataService.getOne(parsedRonin);
        scholarsUpdated.ronin_address = parsedRonin;      
        parsedScholar = new Scholar();
        parsedScholar.parse(scholarsUpdated);
        parsedScholar.name = newScholar.name;
      }
      
      const id = await this.dbService.addScholar(parsedScholar);
      parsedScholar.id = id;
      await this.communiyService.addScholarToComunity(parsedScholar.roninAddress, this.communiyService.activeCommunity.id);
      resolve(parsedScholar);
    })
  }
  
  parseRonin(roninAddress: string){
    if(roninAddress && roninAddress.search('ronin') !== -1){
      roninAddress = "0x"+roninAddress.split(':')[1];
    }
    return roninAddress;
  }
}
