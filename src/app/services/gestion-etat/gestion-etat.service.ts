import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GestionEtatService {

    constructor(private http: HttpClient) {}

    getLogo(): Observable<any> {
        return this.http.get<any>('assets/json/logos.json');
    }
}