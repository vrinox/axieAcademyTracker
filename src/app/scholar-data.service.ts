import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScholarDataService {
  private REST_API_SERVER = 'https://api.lunaciarover.com/stats';

  constructor(private httpClient: HttpClient) { }

  public get(roninAddres: string):Observable<any>{
    return this.httpClient
      .get(`${this.REST_API_SERVER}/${roninAddres}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      )
  }
}
