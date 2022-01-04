import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, signOut, updatePassword } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: Auth) {
  }

  async login(formValues: { email: string, password: string }):Promise<string> {
    return new Promise((resolve, reject)=>{
      signInWithEmailAndPassword(this.afAuth, formValues.email, formValues.password)
      .then(value => {
        resolve(value.user.uid);
      })
      .catch(async err => {
        reject(err.code) 
      });
    })
  }

  loginComplete(uid: string) {
    console.log('login complete',uid);
  }
  async emailSignup(form: { email: string, password: string}):Promise<any> {
    return new Promise((resolve, reject)=>{
      createUserWithEmailAndPassword(this.afAuth, form.email, form.password)
      .then((value) => {
        console.log('userCreated',value.user);
        resolve({
          uid: value.user.uid
        });
      })
      .catch(async error => {
        console.log(error);
        reject()
      });
    });
  }

  logout() {
    signOut(this.afAuth).then(() => {
      console.log('sesion cerrada');
    });
  }

  parseRonin(roninAddress: string){
    if(roninAddress && roninAddress.search('ronin') !== -1){
      roninAddress = "0x"+roninAddress.split(':')[1];
    }
    return roninAddress;
  }

  setUpdatePassword(password: string){
    updatePassword(this.afAuth.currentUser!, password);
  }
}