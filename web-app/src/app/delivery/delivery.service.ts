import { Injectable }    from '@angular/core';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { Options } from 'selenium-webdriver';

import { Delivery } from './delivery';

@Injectable()
export class DeliveryService {
  private headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('0:senha')
  });

  private taURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getDelivery(id: number): Promise<Delivery> {
    const options: any = {headers: this.headers};
    return this.http.get(this.taURL + "/order/"+id, options)
    .toPromise()
    .then(res => {
      return res
    })
    .catch(this.catch);
  }

  accept(id: number): Promise<Delivery> {
    const options: any = {headers: this.headers};
    return this.http.get(this.taURL + "/order/"+id+"/accept", options)
    .toPromise()
    .then(res => {
      return res
    })
    .catch(this.catch);
  }

  reject(id: number): Promise<Delivery> {
    const options: any = {headers: this.headers};
    return this.http.get(this.taURL + "/order/"+id+"/reject", options)
    .toPromise()
    .then(res => {
      return res
    })
    .catch(this.catch);
  }

  collect(id: number): Promise<Delivery> {
    const options: any = {headers: this.headers};
    return this.http.get(this.taURL + "/order/"+id+"/collect", options)
    .toPromise()
    .then(res => {
      return res
    })
    .catch(this.catch);
  }

  finish(id: number): Promise<Delivery> {
    const options: any = {headers: this.headers};
    return this.http.get(this.taURL + "/order/"+id+"/finish", options)
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