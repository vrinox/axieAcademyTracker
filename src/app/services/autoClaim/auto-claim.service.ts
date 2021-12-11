import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { graphqlBodyAxie } from 'src/app/models/graphqlBodyAxie';
import { RandomMessaje, AccessToken } from 'src/app/models/interfaces';
import { RoninWeb3 } from 'src/app/models/RoninWeb3';

@Injectable({
  providedIn: 'root'
})
export class AutoClaimService {
  private API_AXIE: string = 'https://graphql-gateway.axieinfinity.com/graphql';

  private API_CLAIM: string = 'https://game-api.skymavis.com/game-api/clients/'
  private roninWalet = new RoninWeb3();

  constructor(private http: HttpClient) { }

  async startClaimSlp(ronin: string, privateKey: string){
    let randonMessaje: string = await this.getRandomMessage();
    let signFirma = this.roninWalet.web3.eth.accounts.sign(randonMessaje, privateKey);
    let token: string = await this.getAccessToken(ronin, randonMessaje, signFirma.signature);
    this.claim(ronin, token);
  }

  private getRandomMessage(): Promise<string>{
    return new Promise(resolve=>{
      this.http.post(this.API_AXIE, graphqlBodyAxie.getBodyRandomMessage()).subscribe((menssaje: any)=>{
        let randomMenssaje: RandomMessaje = menssaje;
        resolve(randomMenssaje.data.createRandomMessage);
      });
    })
  }

  private getAccessToken(roning: string, message: string, signHex: string): Promise<string>{
    return new Promise(resolve=>{
      this.http.post(this.API_AXIE, graphqlBodyAxie.getBodyAccessToken(roning, message, signHex))
      .subscribe((resToken: any)=>{
        let token: AccessToken = resToken
        resolve(token.data.createAccessTokenWithSignature.accessToken);
      });
    })
  }

  private claim(ronin: string, accesstoken: string){
    return new Promise(resolve=>{
      this.http.post(`${this.API_CLAIM}/${ronin}/items/1/claim`, {},
          {headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
            authorization: `Bearer ${accesstoken}`
          }}).subscribe(res=>{
            resolve(res);
        })
    });
  }
}
