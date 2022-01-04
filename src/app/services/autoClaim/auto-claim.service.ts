import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { graphqlBodyAxie } from 'src/app/models/graphqlBodyAxie';
import { RandomMessaje, AccessToken } from 'src/app/models/interfaces';
import { RoninWeb3 } from 'src/app/models/RoninWeb3';
import { ResAccesToken } from 'src/app/models/interfaces';


@Injectable({
  providedIn: 'root'
})
export class AutoClaimService {
  private API_AXIE: string = 'https://graphql-gateway.axieinfinity.com/graphql';

  private API_CLAIM: string = 'https://game-api.skymavis.com/game-api/clients/'
  private roninWalet = new RoninWeb3();
  private CHAIN_ID: number = 2020;

  constructor(private http: HttpClient) { }

  async startClaimSlp(ronin: string, privateKey: string){
    let randonMessaje: string = await this.getRandomMessage();
    let signFirma = this.roninWalet.web3.eth.accounts.sign(randonMessaje, privateKey);
    let token: string = await this.getAccessToken(ronin, randonMessaje, signFirma.signature);
    let balance: ResAccesToken = await this.resAccesToken(ronin, token);
    await this.claim(
      ronin, privateKey, 
      balance.blockchain_related.signature.amount, 
      balance.blockchain_related.signature.timestamp,
      balance.blockchain_related.signature.signature)
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

  private resAccesToken(ronin: string, accesstoken: string): Promise<any>{
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

  async transferSlp(
    from: string, 
    to: string,
    privatekey: string, 
    amount: number){
      const transaction = await this.roninWalet.getTransaccionTransfer(to, amount);
      return this.signAndSendTransaction(from, this.roninWalet.SLP_CONTRACT, privatekey, 100000, transaction);
  }

  private async claim(
    ronin: string, 
    privatekey: string, 
    amount: number, 
    timestamp: number,
    signature: string): Promise<void>{
      const transaction = await this.roninWalet.getContracChekpoint(ronin, amount, timestamp, signature);
      this.signAndSendTransaction(ronin, this.roninWalet.SLP_CONTRACT, privatekey, 100000, 
        transaction
      ).then((data)=>{console.log(data)});
  }

  private async signAndSendTransaction(from: string, to: string, privateKey: string, gas: number, transaction: any):Promise<any>{
    let signTransaction  = this.roninWalet.getRoningProvier();
    let sing: any = await signTransaction.eth.accounts.signTransaction({
      chainId: this.CHAIN_ID,
      data: transaction.encodeABI(),
      from: from,
      gas,
      gasPrice: 0,
      nonce: await this.getTransactionCount(from),
      to: to,
    }, privateKey);
    return await signTransaction.eth.sendSignedTransaction(
      sing.rawTransaction
    );
  }

  private async getTransactionCount(walletAddress: string){
    const finalWalletAddres = this.roninWalet.getRoningProvier();
    return await finalWalletAddres.eth.getTransactionCount(
      walletAddress
    );
  };
}
