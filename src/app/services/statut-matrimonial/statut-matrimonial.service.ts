import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { StatutMatrimonial } from 'app/interfaces/statut-matrimonial/statutMatrimonial';

@Injectable({
    providedIn: 'root'
})
export class StatutMatrimonialService {

    private url = `${environment.api}/statutMatrimonial`;

    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de StatutMatrimonial
    save(statutMatrimonial: StatutMatrimonial): Observable<any> {
        return this.http.post<any>(`${this.url}`, statutMatrimonial);
    }

    // Modifier un enregistrement de StatutMatrimonial
    update(statutMatrimonial: StatutMatrimonial): Observable<any> {
        return this.http.put<any>(`${this.url}/${statutMatrimonial.id}`, statutMatrimonial);
    }

    // Supprime un enregistrement de StatutMatrimonial
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Trouve tous les enregistrements de StatutMatrimonial
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }

    // Trouve tous les enregistrements de StatutMatrimonial en fonction du parametre
    query(queryParameter: any): Observable<any> {
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }

    // Trouve un seul enregistrements de StatutMatrimonial
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }
}
