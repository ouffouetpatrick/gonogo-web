import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Employe } from 'app/interfaces/employe/employe';

@Injectable({
    providedIn: 'root'
})
export class EmployeService {

    private url = `${environment.api}/employe`;

    // Variable qui contient la liste des employés retournée 
    // Declarée ici pour qu'elle soit accessible partout
    // Cette affectation se passe dans enregistrement.component.ts (getListeEmploye)
    public listeEmployes: any = { etat: null, data: <Employe[]>[] };

    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de Employe
    save(employe: Employe): Observable<any> {
        return this.http.post<any>(`${this.url}`, employe);
    }

    // Modifier un enregistrement de Employe
    update(employe: Employe): Observable<any> {
        return this.http.put<any>(`${this.url}/${employe.id}`, employe);
    }

    // Supprime un enregistrement de Employe
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Trouve tous les enregistrements de Employe
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }

    query(queryParameter: any): Observable<any> {
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }

    // Trouve un seul enregistrements de Employe
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }


    // Route API metier

    // getListeEmploye(): Observable<any> {
    //     return this.http.get<any>(`${environment.api}/metier/employe/recupererEmploye`);
    // }

    ajouterEmploye(employe): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/employe/AjouterEmploye`, employe);
    }

    supprimerEmploye(employe): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/employe/supprimerEmploye`, employe);
    }

    //Recherche journalière
    getEmployeRechercheeByDay(queryParameter): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/employe/rechercherByDay`, queryParameter);
    }

    //Recherche hebdomadaire
    getEmployeRechercheeByWeek(queryParameter): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/employe/rechercherByWeek`, queryParameter);
    }

    //Recherche mensuelle
    getEmployeRechercheeByMonth(queryParameter): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/employe/rechercherByMonth`, queryParameter);
    }

    //Recherche annuelle
    getEmployeRechercheeByYear(queryParameter): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/employe/rechercherByYear`, queryParameter);
    }
}
