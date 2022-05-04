import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RegisterService {
    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private taURL: string = 'http://localhost:3000/deliverers/';

    constructor(private http: HttpClient) { }

    register(name: string, email: string, password: string, phoneNumber: string, cnh: string, birth: Date, zipcode: string, street: string, number: number, neighborhood: string, city: string, state: string, complement: string) {
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

        return this.http.post<any>(this.taURL, body)
        .toPromise()
        .then(res => {
            return res
        })
        .catch(this.catch);
    }

    private catch(error: any): Promise<any> {
        console.error('Oops, something went wrong',error);
        return Promise.reject(error.error.failure || error.message || error);
    }
}