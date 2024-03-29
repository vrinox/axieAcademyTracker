import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PriceGoingeko } from 'src/app/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GetPriceService {
  private API_RES_COINGECKO: String = 'https://api.coingecko.com/api/v3/simple';

  private httpOptions = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*'
    })
  };
  
  constructor(private http: HttpClient) { }

  get(idCrypto: string): Promise<number>{
    return new Promise((resolve)=>{
      this.http.get(`${this.API_RES_COINGECKO}/price?ids=${idCrypto}&vs_currencies=usd`, 
                    this.httpOptions).subscribe((res: any) =>{
                      resolve(parseFloat(res[idCrypto].usd.toFixed(2)));
                    });
    })
  }

}
