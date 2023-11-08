import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { StatutJuridique } from 'app/interfaces/statut-juridique/statutJuridique';

@Injectable({
    providedIn: 'root'
})
export class StatutJuridiqueService {

    private url = `${environment.api}/statutJuridique`;

    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de StatutJuridique
    save(statutJuridique: StatutJuridique): Observable<any> {
        return this.http.post<any>(`${this.url}`, statutJuridique);
    }

    // Modifier un enregistrement de StatutJuridique
    update(statutJuridique: StatutJuridique): Observable<any> {
        return this.http.put<any>(`${this.url}/${statutJuridique.id}`, statutJuridique);
    }

    // Supprime un enregistrement de StatutJuridique
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Trouve tous les enregistrements de StatutJuridique
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }

    query(queryParameter: any): Observable<any> {
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }

    // Trouve un seul enregistrements de StatutJuridique
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }
}
