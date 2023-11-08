import { Entreprise } from "../entreprise/entreprise";

export interface DomaineActivite{
    id: number,
    libelle: string,
    empty1?: string,
    empty2?: string,
    empty3?: string,
    geler: number,
    dateCreation: string,
    idusrcreation: number,
    entreprise: Entreprise[];
}