import { Utilisateur } from "../administration/utilisateur";
import { DomaineActivite } from "../domaine-activite/domaineActivite";
import { Employe } from "../employe/employe";
import { StatutJuridique } from "../statut-juridique/statutJuridique";

export interface Entreprise{
    id?: number,
    nom: string,
    contact: string,
    localisation: string,
    empty1?: string,
    empty2?: string,
    empty3?: string,
    geler: number,
    dateCreation: string,
    idusrcreation: number,
    domaineActivite: DomaineActivite,
    statutJuridique: StatutJuridique,
    utilisateur: Utilisateur[],
    employe: Employe[],
}