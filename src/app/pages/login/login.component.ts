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
  form: FormGroup = new FormGroup({
    user: new FormControl('',[
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('',[
      Validators.required
    ])
  });
  registerForm: FormGroup = new FormGroup({
    email: new FormControl('',[
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('',[
      Validators.required
    ]),
    confirm_pass: new FormControl('',[
      Validators.required
    ]),
    community: new FormControl('',[
      Validators.required
    ])
  });
  showRegisterForm: boolean = false;
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
    if(this.form.valid){
      this.enviarDatos();
    }
  }
  async enviarDatos(): Promise<void>{
    const result: string = await this.auth.login({
      email: this.form.value.user,
      password: this.form.value.password
    })
    const userLink: userLink = await this.dbService.getUserLink('uid',result);
    let scholar: Scholar = new Scholar();
    let identificator = (userLink.roninAddress) ? userLink.roninAddress : userLink.uid;
    if(userLink.roninAddress){
      scholar = await this.dbService.getScholar('roninAddress', userLink.roninAddress);
      if(!scholar.roninAddress){
        return;
      }
    }
    let communities: community[] = await this.communityService.getCommunities(identificator);
    communities = communities.filter(c=> c.id !== '');
    let community = communities.find((c)=> c.admin === identificator);
    if(community){
      this.sesion.start(userLink, scholar, communities.filter( c=> c.admin === identificator));
      this.communityService.activeCommunity = community;
      this.sesion.setLoading(true);
    }else{
      console.log('debes ser admin de una comunidad para entrar en esta herramienta');
    }
  }
  async registerNewUser(): Promise<void>{
    this.auth.emailSignup({
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    }).then(async (userLinkData: userLink) => {
      const uid: string = await this.dbService.addUserLink(userLinkData);
      let community:community = await this.communityService.addCommunity({
        name: this.registerForm.value.community,
        admin: uid,
        discord: '',
        rankType: 'mmr',
        type: 'Academy'
      })
      this.sesion.start(userLinkData, new Scholar(), [community]);
      this.communityService.activeCommunity = community;
      this.sesion.setLoading(true);
    }).catch((err)=>{
      console.log(err);
    })
  }
}
