import { Entreprise } from "../entreprise/entreprise";
import { MetierEmploye } from "../metier-employe/metierEmploye";
import { StatutMatrimonial } from "../statut-matrimonial/statutMatrimonial";
import { TypePiece } from "../type-piece/typePiece";

export interface Employe{
    id?: number,
    nom: string,
    prenom: string,
    sexe: number,
    dateNaissance: string,
    numeroPiece: string,
    contact1: string,
    contact2: string,
    specialiteMetier: string,
    professionAnterieur: number,
    anneeExperiencePoste: number,
    anneeExperiencePosteAnterieur: number,
    nombreEnfant: number,
    residencePermanent: string,
    residenceActuel: string,
    empty1?: string,
    empty2?: string,
    empty3?: string,
    geler: number,
    dateCreation: string,
    idusrcreation: number,
    entreprise: Entreprise,
    typePiece: TypePiece,
    statutMatrimonial: StatutMatrimonial,
    metierEmploye: MetierEmploye,
}