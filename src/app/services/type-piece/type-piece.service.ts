import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { TypePiece } from 'app/interfaces/type-piece/typePiece';

@Injectable({
    providedIn: 'root'
})
export class TypePieceService {

    private url = `${environment.api}/typePiece`;

    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de TypePiece
    save(typePiece: TypePiece): Observable<any> {
        return this.http.post<any>(`${this.url}`, typePiece);
    }

    // Modifier un enregistrement de TypePiece
    update(typePiece: TypePiece): Observable<any> {
        return this.http.put<any>(`${this.url}/${typePiece.id}`, typePiece);
    }

    // Supprime un enregistrement de TypePiece
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Trouve tous les enregistrements de TypePiece
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }

    // Trouve tous les enregistrements de TypePiece en fonction du parametre
    query(queryParameter: any): Observable<any> {
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }

    // Trouve un seul enregistrements de TypePiece
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }
}
