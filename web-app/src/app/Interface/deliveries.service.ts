import { Injectable }    from '@angular/core';
import {  HttpClient, HttpHeaders } from '@angular/common/http';

import { Delivery } from './delivery';
import { Observable } from 'rxjs';

@Injectable()
export class DeliveriesService {

  //lembrete btoa('1:senha') vai ser substituido futuramente.
  private headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('1:senha')
  });

  private taURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getDeliveries(): Promise<Delivery[]> {
    const options: any = {headers: this.headers};
    return this.http.get(this.taURL + "/orders", options)
    .toPromise()
    .then(res => {
      return res
    })
    .catch(this.catch);
  }

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

  evaluation(id: number, rScore:number, cScore: number): Promise<Delivery> {
    const options: any = {headers: this.headers};
    const body: any = {id:id,restaurantScore: rScore,  clientScore: cScore}
    return this.http.post(this.taURL + "/evaluation", body, options)
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