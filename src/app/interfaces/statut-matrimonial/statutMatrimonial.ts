import { Employe } from "../employe/employe";

export interface StatutMatrimonial{
    id: number,
    libelle: string,
    empty1?: string,
    empty2?: string,
    empty3?: string,
    geler: number,
    dateCreation: string,
    idusrcreation: number,
    employe: Employe[];
}