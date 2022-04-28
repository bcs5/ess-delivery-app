import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Delivery } from './delivery';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryManService {

  //lembrete btoa('0:senha') vai ser substituido futuramente.
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('0:senha')
  });

  private taURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    return this.http.get<any>(this.taURL + "/user", {headers: this.headers});
  }

}
