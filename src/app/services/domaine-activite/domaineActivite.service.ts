import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomaineActivite } from 'app/interfaces/domaine-activite/domaineActivite';

@Injectable({
    providedIn: 'root'
})
export class DomaineActiviteService {

    private url = `${environment.api}/domaineActivite`;

    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de DomaineActivite
    save(domaineActivite: DomaineActivite): Observable<any> {
        return this.http.post<any>(`${this.url}`, domaineActivite);
    }

    // Modifier un enregistrement de DomaineActivite
    update(domaineActivite: DomaineActivite): Observable<any> {
        return this.http.put<any>(`${this.url}/${domaineActivite.id}`, domaineActivite);
    }

    // Supprime un enregistrement de DomaineActivite
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Trouve tous les enregistrements de DomaineActivite
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }

    // Trouve tous les enregistrements de DomaineActivite en fonction du parametre
    query(queryParameter: any): Observable<any> {
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }

    // Trouve un seul enregistrements de DomaineActivite
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    //Supprimer domaine activité
    supprimerDomaineActivite(domaineActivite): Observable<any> {
        return this.http.post<any>(`${this.url}/supprimerDomaineActivite`, domaineActivite);
    }
}
