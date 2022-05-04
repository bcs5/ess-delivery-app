import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserAccountService {
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private taURL: string = 'http://localhost:3000/';

    constructor(private http: HttpClient) { }

    getInfos(): Promise<any> {
        const options: any = {headers: this.headers};
        return this.http.get<any>(this.taURL + 'deliverer/logged/', options)
        .toPromise()
        .then(res => {
            return res
        })
        .catch(this.catch);
    };

    updateInfos(name: string, email: string, password: string, phoneNumber: string, cnh: string, birth: Date, zipcode: string, street: string, number: number, neighborhood: string, city: string, state: string, complement: string): Promise<any> {
        const options: any = {headers: this.headers};
        
        let body = {
            'name': name,
            'email': email,
            'password': password,
            'phoneNumber': phoneNumber,
            'cnh': cnh,
            'birth': birth,
            'zipcode': zipcode,
            'street': street,
            'number': number,
            'neighborhood': neighborhood,
            'city': city,
            'state': state,
            'complement': complement
        };
        
        return this.http.put<any>(this.taURL + 'deliverer/logged/', body, options)
        .toPromise()
        .then(res => {
            return res
        })
        .catch(this.catch);
    };

    deleteInfos(): Promise<any> {
        const options: any = {headers: this.headers};
        return this.http.put<any>(this.taURL + 'deliverer/delete/', options)
        .toPromise()
        .then(res => {
            return res
        })
        .catch(this.catch);
    };

    logout(): Promise<any> {
        return this.http.post<any>(this.taURL + 'deliverer/logout/', '')
        .toPromise()
        .then(res => {
            return res
        })
        .catch(this.catch);
    };

    private catch(error: any): Promise<any> {
        console.error('Oops, something went wrong',error);
        return Promise.reject(error.error.failure || error.message || error);
    }
}