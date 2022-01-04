import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SessionsService } from '../services/sessions/sessions.service';
import { GetAxiesService } from '../services/getAxies/get-axies.service';
import { Scholar } from '../models/scholar';
import { Perfiles } from '../models/interfaces';
import { AxiesData } from '../models/interfaces';
import { RoninWeb3 } from '../models/RoninWeb3';
import { AutoClaimService } from '../services/autoClaim/auto-claim.service';
import secrets from '../../assets/json/secrets.json';
import spanish from '../../assets/json/lenguaje/spanishLanguaje.json';
import english from '../../assets/json/lenguaje/englishLanguage.json';
import { StorageService } from '../services/storage/storage.service';
import { DatabaseService } from '../services/database/database.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalExitPlayerComponent } from '../components/modal-exit-player/modal-exit-player.component';
import { AgregarNewBecadoService } from '../services/agregarNewBecado/agregar-new-becado.service';
@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.sass']
})

export class PerfilesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'axies', 'slp', 'axs', 'weth', 'delete'];
  imgView: number[] = [0, 1, 2];
  @ViewChild(MatSort, { static: false }) sort?: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<Perfiles> = new MatTableDataSource();
  perfiles: Perfiles[] = [];
  roninAdress: string[] = [];
  roninWalet = new RoninWeb3();
  idiom: any = {};

  dark: boolean = false;

  constructor(
    private session: SessionsService,
    private getAxies: GetAxiesService,
    private autoClaim: AutoClaimService,
    private storage: StorageService,
    private sessions: SessionsService,
    private database: DatabaseService,
    public dialog: MatDialog,
    private newBecado: AgregarNewBecadoService
  ) { }

  ngOnInit(): void {
    this.dark = this.sessions.dark;
    this.changeDarkMode();
    this.start();
    this.changeCommunity();
    this.addNewBecado();
  }

  async start(): Promise<void> {
    this.getLangueaje();
    this.changeIdiom();
    await this.getAxiesData(this.session.scholar);
  }

  changeDarkMode(): void {
    this.sessions.getDarkMode().subscribe(mode => {
      this.dark = mode;
    });
  }

  getLangueaje(): void {
    let lenguage: string | null = this.storage.getItem('language');
    if (lenguage === 'es-419' || lenguage === 'es') {
      this.idiom = spanish.perfiles;
    } else {
      this.idiom = english.perfiles;
    };
  }

  changeIdiom(): void {
    this.sessions.getIdiom().subscribe(change => {
      if (change) {
        this.getLangueaje();
      }
    })
  }

  async getAxiesData(scholars: Scholar[]): Promise<void> {
    let retryAxie: Scholar[] = [];
    await Promise.all(
      scholars.map(scholar => {
        return this.createPerfil(scholar)
          .catch((scholar: Scholar) => {
            retryAxie.push(scholar);
          });
      })
    );
    if (retryAxie.length !== 0) {
      this.getAxiesData(retryAxie);
    } else {
      this.loadBalancePerfil();
      this.loadTable();
    }
  }

  async createPerfil(scholar: Scholar) {
    return await this.getAxies.get(scholar).then((axies: AxiesData[]) => {
      let imgAxie: string[] = [];
      axies.forEach(axie => imgAxie.push(axie.image));
      this.roninAdress.push(scholar.roninAddress);
      this.setPerfil(imgAxie, scholar.name, scholar.roninAddress, scholar.personalAddress);
    });
  }


  setPerfil(axiesData: string[], namePlayer: string, roninAddress: string, personalAddress: string): void {
    this.perfiles.push({
      name: namePlayer,
      axies: axiesData,
      ronin: roninAddress,
      axs: 'load',
      slp: 'load',
      weth: 'load',
      personalAddress: personalAddress
    })
  }

  loadBalancePerfil(): void {
    this.perfiles.forEach((perfil, index) => {
      this.getCrytoRonin(perfil, index);
    });
  }

  getCrytoRonin(perfil: Perfiles, index: number): void {
    this.getRoninCryto(this.roninAdress[index], this.roninWalet.SLP_CONTRACT).then(Balance => {
      perfil.slp = Balance;
    });
    this.getRoninCryto(this.roninAdress[index], this.roninWalet.AXS_CONTRACT).then(Balance => {
      perfil.axs = this.parseWeth(Balance);
    });
    this.getRoninCryto(this.roninAdress[index], this.roninWalet.WETH_CONTRACT).then(Balance => {
      perfil.weth = this.parseWeth(Balance);
    });
  }

  async getRoninCryto(ronin: string, contract: string): Promise<string> {
    return await this.roninWalet.getBalance(contract, ronin);
  }

  parseWeth(weth: string): string {
    return parseFloat(this.roninWalet.web3.utils.fromWei(weth)).toFixed(5);
  }

  loadTable(): void {
    this.dataSource = new MatTableDataSource(this.perfiles);
    this.dataSource.sort = this.sort!;
    this.dataSource.paginator = this.paginator;
  }

  async claimSlp(): Promise<void> {
    // secrets.forEach(scholar => {
    //   this.autoClaim.startClaimSlp(scholar.ronin, scholar.secret);
    // });
  }

  deleteScholar(perfiles: Perfiles): void {
    this.session.modalScholarName = perfiles.name;
    const dialogRef = this.dialog.open(ModalExitPlayerComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.database.deleteScholar(perfiles.ronin);
      };
    });
  }

  filterName(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createCsvFile() {
    let csv = "";
    this.perfiles.map((p) => {
      csv += `${p.name};${p.ronin};${p.slp}\r\n`;
    })
    console.log(csv);
  }

  createJSONFile() {
    let json = "[";
    this.perfiles.map((p) => {
      if(json.length !== 1){
        json += ',';
      }
      json += `{
        "name":"${p.name}",
        "ronin":"${p.ronin}",
        "roninPersonal":"${p.personalAddress || ''}",
        "secret":""
      }`;
    })
    json += "]";
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(json));
    element.setAttribute('download', "secrets.json");
    document.body.appendChild(element);
    element.click();
  }

  changeCommunity(): void {
    this.sessions.getScholar().subscribe(scholar => {
      this.perfiles = [];
      this.start();
    });
  }


  addNewBecado() {
    this.newBecado.getNewBecado().subscribe(async scholar => {
      await this.createPerfil(scholar);
      let lastPerfil: number = this.perfiles.length - 1;
      this.getCrytoRonin(this.perfiles[lastPerfil], lastPerfil);
    })
  }

}