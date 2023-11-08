import { Entreprise } from '../entreprise/entreprise';
import { UtilisateurModuleDroit } from './utilisateur-module-droit';
import { UtilisateurProfil } from './utilisateur-profil';
export interface Utilisateur {
    id?: number,
    nom: string,
    prenom: string,
    pseudo: string,
    email: string,
    motDePasse: string,
    contact: string,
    empty1?: string,
    empty2?: string,
    empty3?: string,
    geler: number,
    dateCreation: string,
    idusrcreation: number,
    utilisateurProfil: UtilisateurProfil[],
    utilisateurModuleDroit : UtilisateurModuleDroit[],
    entreprise?: Entreprise,
    avatar?: string;
    status?: string;
}