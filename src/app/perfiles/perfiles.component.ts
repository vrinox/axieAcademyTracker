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
  axiesImagen: AxiesImage[] = [];
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
          this.axiesImagen.push({
            axies: imgAxie,
            name: scholar.name,
            ronin: scholar.roninAddress
          });
        }).catch((scholar: Scholar) =>{
          retryAxie.push(scholar);
        });
      })
    );
    if(retryAxie.length !== 0){
      this.getAxiesData(retryAxie);
    }else{
      await this.loadPerfil();
      this.loadTable();
      this.sortDescTable();
    }
  }
  
  async loadPerfil(): Promise<void>{
    await Promise.all(
      this.axiesImagen.map(data=>{
        return this.createPerfil(data.name, data.axies, data.ronin);
      })
    );
  }

  async createPerfil(name: string, axies: string[], ronin: string): Promise<boolean>{
    this.perfiles.push({
      name: name,
      axies: axies,
      slp: await this.getRoninCryto(ronin, this.roninWalet.SLP_CONTRACT),
      axs: await this.getRoninCryto(ronin, this.roninWalet.AXS_CONTRACT),
      weth: this.parseWeth(await this.getRoninCryto(ronin, this.roninWalet.WETH_CONTRACT))
    });
    return Promise.resolve(true);
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

  sortDescTable(): void{
    this.dataSource.data = this.dataSource.data.sort((a, b)=> parseInt(b.slp) - parseInt(a.slp));
  }
}
