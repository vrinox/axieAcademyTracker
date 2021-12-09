import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SessionsService } from '../services/sessions/sessions.service';
import { GetAxiesService } from '../services/getAxies/get-axies.service';
import { Scholar } from '../models/scholar';
import { Perfiles, AxiesImage } from '../models/interfaces';
import { AxiesData } from '../models/interfaces';
import { RoninWeb3 } from '../models/RoninWeb3';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.sass']
})

export class PerfilesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'axies', 'slp', 'axs', 'weth'];
  imgView: number[] = [0, 1, 2];
  @ViewChild(MatSort, { static: false }) sort?: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<Perfiles> = new MatTableDataSource();
  perfiles: Perfiles[] = [];
  roninAdress: string[] = [];
  roninWalet = new RoninWeb3();

  constructor(private session: SessionsService, private getAxies: GetAxiesService) { }

  ngOnInit(): void {
    this.start();
  }

  async start(){
    await this.getAxiesData(this.session.scholar);
  }

  async getAxiesData(scholars: Scholar[]): Promise<void>{
    let retryAxie: Scholar[] = [];
    await Promise.all(
      scholars.map(scholar=>{
        return this.getAxies.get(scholar).then((axies: AxiesData[])=>{
          let imgAxie: string[] = [];
          axies.forEach(axie=> imgAxie.push(axie.image));
          this.roninAdress.push(scholar.roninAddress);
          this.createPerfil(imgAxie, scholar.name);
        }).catch((scholar: Scholar) =>{
          retryAxie.push(scholar);
        });
      })
    );
    if(retryAxie.length !== 0){
      this.getAxiesData(retryAxie);
    }else{
      this.loadBalancePerfil();
      this.loadTable();
    }
  }

  createPerfil(axiesData: string[], namePlayer: string): void{
    this.perfiles.push({
      name: namePlayer,
      axies: axiesData,
      axs: 'load',
      slp: 'load',
      weth: 'load'
    })
  }

  loadBalancePerfil(): void{
    this.perfiles.forEach((perfil, index)=>{
      this.getRoninCryto(this.roninAdress[index], this.roninWalet.SLP_CONTRACT).then(Balance =>{
        perfil.slp = Balance;
      });
      this.getRoninCryto(this.roninAdress[index], this.roninWalet.AXS_CONTRACT).then(Balance =>{
        perfil.axs = Balance;
      });
      this.getRoninCryto(this.roninAdress[index], this.roninWalet.WETH_CONTRACT).then(Balance =>{
        perfil.weth = this.parseWeth(Balance);
      });
    })
  }

  async getRoninCryto(ronin: string, contract: string): Promise<string>{
    return await this.roninWalet.getBalance(contract, ronin);
  }

  parseWeth(weth: string): string{
    return parseFloat(this.roninWalet.web3.utils.fromWei(weth)).toFixed(5);
  }

  loadTable():void {
    this.dataSource = new MatTableDataSource(this.perfiles);
    this.dataSource.sort = this.sort!;
    this.dataSource.paginator = this.paginator;
  }
}
