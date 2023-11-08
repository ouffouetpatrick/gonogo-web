import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Entreprise } from 'app/interfaces/entreprise/entreprise';

@Injectable({
    providedIn: 'root'
})
export class EntrepriseService {

    private url = `${environment.api}/entreprise`;

    constructor(private http: HttpClient) {}

    // Ajoute un nouvel enregistrement de Entreprise
    save(entreprise: Entreprise): Observable<any> {
        return this.http.post<any>(`${this.url}`, entreprise);
    }

    // Modifier un enregistrement de Entreprise
    update(entreprise: Entreprise): Observable<any> {
        return this.http.put<any>(`${this.url}/${entreprise.id}`, entreprise);
    }

    // Supprime un enregistrement de Entreprise
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Trouve tous les enregistrements de Entreprise
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }

    query(queryParameter: any): Observable<any> {
        console.log(queryParameter);
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }

    // Trouve un seul enregistrements de Entreprise
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }


    // Route API metier

    getListeEntreprise(): Observable<any> {
        return this.http.get<any>(`${environment.api}/metier/entreprise/recupererEntreprise`);
    }

    ajouterEntreprise(entreprise): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/entreprise/AjouterEntreprise`, entreprise);
    }

    supprimerEntreprise(entreprise): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/entreprise/supprimerEntreprise`, entreprise);
    }
}
