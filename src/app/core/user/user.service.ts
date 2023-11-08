import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
// import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';

const baseurl: string = environment.api

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<Utilisateur> = new ReplaySubject<Utilisateur>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {}

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: Utilisateur)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<Utilisateur>
    {
        return this._user.asObservable();
    }

    get(): Observable<Utilisateur>
    {
        const userId = JSON.parse(localStorage.getItem('user'))

        return this._httpClient.get<Utilisateur>(`${baseurl}/utilisateur/query/${encodeURI(JSON.stringify({ 
                order: { id: 'DESC' }, 
                relations: [
                    'utilisateurProfil', 
                    'utilisateurProfil.profil',
                    'entreprise'
                ], 
                where: { id: userId?.id } 
            }))}`).pipe(
            tap((user) => {
                this._user.next(user[0]);
            })
        );
    }

    

    /**
     * Update the user
     *
     * @param user
     */
    update(user: Utilisateur): Observable<any>
    {
        return this._httpClient.patch<Utilisateur>('api/common/user', {user}).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}
