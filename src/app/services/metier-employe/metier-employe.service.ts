import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { MetierEmploye } from 'app/interfaces/metier-employe/metierEmploye';

@Injectable({
    providedIn: 'root'
})
export class MetierEmployeService {

    private url = `${environment.api}/metierEmploye`;

    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de MetierEmploye
    save(metierEmploye: MetierEmploye): Observable<any> {
        return this.http.post<any>(`${this.url}`, metierEmploye);
    }

    // Modifier un enregistrement de MetierEmploye
    update(metierEmploye: MetierEmploye): Observable<any> {
        return this.http.put<any>(`${this.url}/${metierEmploye.id}`, metierEmploye);
    }

    // Supprime un enregistrement de MetierEmploye
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Trouve tous les enregistrements de MetierEmploye
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }

    // Trouve tous les enregistrements de MetierEmploye en fonction du parametre
    query(queryParameter: any): Observable<any> {
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }

    // Trouve un seul enregistrements de MetierEmploye
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    //Supprimer metier
    supprimerMetier(metier): Observable<any> {
        return this.http.post<any>(`${this.url}/supprimerMetier`, metier);
    }
}
