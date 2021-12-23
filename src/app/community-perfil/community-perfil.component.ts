import { Component, OnInit } from '@angular/core';
import { ComunityService } from '../services/community.service';
import { SessionsService } from '../services/sessions/sessions.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { community, userLink } from '../models/interfaces';
import { StorageService } from '../services/storage/storage.service';
import { AuthService } from '../services/auth.service';
import spanish from '../../assets/json/lenguaje/spanishLanguaje.json';
import english from '../../assets/json/lenguaje/englishLanguage.json';

@Component({
  selector: 'app-community-perfil',
  templateUrl: './community-perfil.component.html',
  styleUrls: ['./community-perfil.component.sass']
})
export class CommunityPerfilComponent implements OnInit {

  comunities: community[] = [];

  createCommunities: boolean = false;

  communitiesName: community[] = [];

  passwordIncorrect: boolean = false;

  changePassword: boolean = false;

  idiom: any = {};

  constructor(public comunity: ComunityService,
    private sessions: SessionsService,
    private storage: StorageService,
    private auth: AuthService) { }

  FormCommunity = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    admin: new FormControl(''),
    discord: new FormControl('', [
      Validators.required
    ]),
    type: new FormControl('', [
      Validators.required
    ]),
    rankType: new FormControl('', [
      Validators.required
    ])
  });

  FormChangePass  = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
  });

  ngOnInit(): void {
    this.setNameComunities();
    this.getNotCurrentComunity();
    this.getUserRonin();
    this.getLangueaje();
    this.changeIdiom();
  }

  getLangueaje(): void{
    let lenguage: string | null = this.storage.getItem('language');
    if(lenguage === 'es-419' || lenguage === 'es'){
      this.idiom = spanish.perfilComunities;
    }else{
      this.idiom = english.perfilComunities;
    };
    console.log(this.idiom)
  }

  changeIdiom() :void{
    this.sessions.getIdiom().subscribe(change=>{
      if(change){
        this.getLangueaje();
      }
    });
  }

  setNameComunities(): void{
    this.comunities = [... this.sessions.communities];
  }

  async createCommunity(){
    this.FormCommunity.controls.admin.setValue(this.getUserRonin());
    let community: community = await this.comunity.addCommunity(this.FormCommunity.value);
    this.setNewCommunityStore(community);
    this.comunities.push(community)
    this.createCommunities = false;
  }

  getUserRonin(): string{
    let user: userLink = JSON.parse(this.storage.getItem('user')!);
    return user.roninAddress
  }

  deleteCommunities(comunityDelete: community, index: number): void{
    this.comunity.deleteCommunity(comunityDelete.id);
    this.comunities.splice(index+1, 1);
    this.getNotCurrentComunity();
    this.setStoreComunities(this.comunities);
  }

  setNewCommunityStore(newCommunity: community): void{
    let communities: community[] = JSON.parse(this.storage.getItem('communities')!);
    communities.push(newCommunity);
    this.setStoreComunities(communities)
  }

  setStoreComunities(communities: community[]): void{
    this.storage.setItem('communities', JSON.stringify(communities));
  }

  changeCommunities(changeCommunity: community, index: number): void{
    this.sessions.changeCommunity(changeCommunity);
    this.getNotCurrentComunity();
    this.comunities.splice(index, 1);
    this.comunities.unshift(changeCommunity);
    this.setStoreComunities(this.comunities);
    this.storage.setItem('community', changeCommunity.name);
  }

  getNotCurrentComunity(): void{
    this.communitiesName = [];
    this.comunities.forEach(comunity=>{
      if(this.comunity.activeCommunity.name !== comunity.name){
        this.communitiesName.push(comunity);
      }; 
    });
  };

  setChangePassword(): void{
    if(this.FormChangePass.valid){
      this.auth.setUpdatePassword(this.FormChangePass.controls.password.value);
      this.changePassword = false;
    }
  }

  confirmPassWord(): void{
    if(this.FormChangePass.valid){
      if(this.FormChangePass.controls.password.value !== this.FormChangePass.controls.confirmPassword.value){
        this.passwordIncorrect = true;
        this.FormChangePass.controls.password.setErrors({ err: true });
        this.FormChangePass.controls.confirmPassword.setErrors({ err: true });
      }else{
        this.passwordIncorrect = false;
      };
    }else{
      this.FormChangePass.controls.password.updateValueAndValidity();
      this.FormChangePass.controls.confirmPassword.updateValueAndValidity();
    };
  }


}
