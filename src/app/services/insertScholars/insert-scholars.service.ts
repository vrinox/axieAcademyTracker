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
      delete newScholar.apellido
      let scholarsUpdated: scholarOfficialData = await this.schDataService.getOne(parsedRonin);

      let scholar = new Scholar(newScholar);
      scholar.parse(scholarsUpdated);
      scholar.roninAddress = parsedRonin

      const id = await this.dbService.addScholar(scholar);
      scholar.id = id;
      await this.communiyService.addScholarToComunity(scholar.roninAddress, this.communiyService.activeCommunity.id);
      resolve(scholar);
    })
  }
  
  parseRonin(roninAddress: string){
    if(roninAddress && roninAddress.search('ronin') !== -1){
      roninAddress = "0x"+roninAddress.split(':')[1];
    }else if(roninAddress.search('0x') === -1){
      roninAddress = `0x${roninAddress}`
    }
    return roninAddress;
  }
}
