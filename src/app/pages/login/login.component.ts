import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { community, userLink } from 'src/app/models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { AuthService } from 'src/app/services/auth.service';
import { ComunityService } from 'src/app/services/community.service';
import { DatabaseService } from 'src/app/services/database/database.service';
import { SessionsService } from 'src/app/services/sessions/sessions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  formBecado: FormGroup = new FormGroup({
    user: new FormControl('',[
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('',[
      Validators.required
    ])
  })
  constructor(
    private auth: AuthService,
    private dbService: DatabaseService,
    private communityService: ComunityService,
    private sesion: SessionsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.sesion.init){
      this.router.navigate(['/scholars'],{replaceUrl:true});
    }
  }
  public revisarValido(): void{
    if(this.formBecado.valid){
      this.enviarDatos();
    }
  }
  async enviarDatos(): Promise<void>{
    const result: string = await this.auth.login({
      email: this.formBecado.value.user,
      password: this.formBecado.value.password
    })
    const userLink: userLink = await this.dbService.getUserLink('uid',result);
    const scholar: Scholar = await this.dbService.getScholar('roninAddress', userLink.roninAddress);
    if(!scholar.roninAddress){
      return;
    }
    let communities: community[] = await this.communityService.getCommunities(userLink.roninAddress);
    communities = communities.filter(c=> c.id !== '');
    let community = communities[0];
    if(community.admin === scholar.roninAddress){
      this.sesion.start(userLink, scholar, communities);
      this.communityService.activeCommunity = community;
      this.sesion.setLoading(true);
    }else{
      console.log('debes ser admin de una comunidad para entrar en esta herramienta');
    }
  }
}
