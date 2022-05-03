import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeliveryManService {

  //lembrete btoa('1:senha') vai ser substituido futuramente.
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('1:senha')
  });

  private taURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getUser(): Promise<any> {
    const options: any = {headers: this.headers};
    return this.http.get<any>(this.taURL + "/user", options)
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
