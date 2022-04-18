import { Injectable }    from '@angular/core';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { Options } from 'selenium-webdriver';

import { Delivery } from './delivery';

@Injectable()
export class DeliveriesService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private taURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getDeliveries(): Promise<Delivery[]> {
    const options:any = {headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Basic ' + btoa('0:senha')
    })};

    return this.http.get(this.taURL + "/orders", options)
    .toPromise()
    .then(res => {
      return res
    })
    .catch(this.catch);
  }


  private catch(erro: any): Promise<any>{
    console.error('Oops, something went wrong',erro);
    return Promise.reject(erro.message || erro);
  }
}