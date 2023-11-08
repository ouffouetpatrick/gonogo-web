import { Entreprise } from "app/interfaces/entreprise/entreprise";

export interface User {
    id: string;
    nom: string;
    prenom: string;
    entreprise : Entreprise
    email: string;
    avatar?: string;
    status?: string;
}
