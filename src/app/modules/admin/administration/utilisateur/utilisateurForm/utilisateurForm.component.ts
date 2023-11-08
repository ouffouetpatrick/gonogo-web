import { REGEX_EMAIL, REGEX_STRONG_PASSWORD } from './../../../../../constants';
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProfilService } from "app/services/administration/profil.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import { Droit } from 'app/interfaces/administration/droit';
import { Module } from 'app/interfaces/administration/module';
import { Profil } from 'app/interfaces/administration/profil';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';
import { EntrepriseService } from 'app/services/entreprise/entreprise.service';
import { Entreprise } from 'app/interfaces/entreprise/entreprise';
import { UtilisateurService } from 'app/services/administration/utilisateur.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: "app-utilisateurForm",
    templateUrl: "./utilisateurForm.component.html",
    styleUrls: ["./utilisateurForm.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class UtilisateurFormComponent implements OnInit {

    utilisateurForm: FormGroup;
    listeProfil: Profil[] = [];
    listeModule: Module[] = [];
    listeDroit: Droit[];
    listeEntreprise: Entreprise[] = [];
    profils = new FormControl("", Validators.required);
    user: Utilisateur;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _formBuilder: FormBuilder,
        private profilService: ProfilService,
        private utilisateurService: UtilisateurService,
        public dialogRef: MatDialogRef<UtilisateurFormComponent>,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: { utilisateur: Utilisateur },
        private _entrepriseService : EntrepriseService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this.userConnect();
        this.getProfil();
        this.getEntreprise();
        this.generateForm();
    }

    userConnect(){
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
                console.log(this.user, 'userUtilisateurForm');
                
            });
    }

    generateForm() {
        this.utilisateurForm = this._formBuilder.group({
            id: [this.data.utilisateur ? this.data.utilisateur.id : null],
            nom: [
                this.data.utilisateur ? this.data.utilisateur.nom : "",
                Validators.required,
            ],
            prenom: [
                this.data.utilisateur ? this.data.utilisateur.prenom : "",
                Validators.required,
            ],
            pseudo: [
                this.data.utilisateur ? this.data.utilisateur.pseudo : "",
                Validators.required,
            ],
            motDePasse: ["", [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]],
            email: [
                this.data.utilisateur ? this.data.utilisateur.email : "",
                [Validators.required, Validators.email, Validators.pattern(REGEX_EMAIL)]
            ],
            contact: [
                this.data.utilisateur ? this.data.utilisateur.contact : "",
                [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern(/^(\d+$)/)]
            ],
            empty1: [
                this.data.utilisateur ? this.data.utilisateur.empty1 : null,
            ],
            empty2: [
                this.data.utilisateur ? this.data.utilisateur.empty2 : null,
            ],
            empty3: [
                this.data.utilisateur ? this.data.utilisateur.empty3 : null,
            ],
            geler: [
                this.data.utilisateur ? this.data.utilisateur.geler : 0,
            ],
            dateCreation: [
                this.data.utilisateur ? this.data.utilisateur.dateCreation : new Date(),
            ],

            idusrcreation: [
                this.user.utilisateurProfil[0].profil.id == 1? 0 : this.user.id
            ],
            entreprise: [
                this.user.utilisateurProfil[0].profil.id == 2? this.user.entreprise.id : null
            ],
        });
    }

    save(): void {
        // this.inProgress = true; // Démarre le loader
        const utilisateur = {
            ...this.utilisateurForm.value,
            profils: this.profils.value
        };

        const send = this.utilisateurService.saveUtilisateurAvecModuleEtDroit(utilisateur) ;

        send.subscribe(async result => {
            // this.inProgress = false; // stop le loader
            if (result) {
                await this._snackBar.open('Utilisateur sauvegardé', 'Fermer', { duration: 2000 ,panelClass: ['success-snackbar'] });
                await this.dialogRef.close({status: "save"});

            } else {
                this._snackBar.open('Impossible d\'enregistrer l\'utilisateur', 'Fermer', { duration: 2000 , panelClass: ['warning-snackbar'] });
            }
        },
        err =>{
          this._snackBar.open('Erreur enregistrement  utilisateur', 'Fermer', { duration: 2000 , panelClass: ['error-snackbar'] });
        });
    }

    getProfil() {
        // this.inProgress = true; // Démarre le loader
        const getProfil = this.profilService.query({ order: { id: "DESC" } });
        getProfil.subscribe((result) => {
            this.listeProfil = result;
        });
    }

    getEntreprise(){
        const getEntreprise = this._entrepriseService.getListeEntreprise();
        getEntreprise.subscribe((result) => {
            this.listeEntreprise = result;
            console.log(result, 'getEntreprise');
            
        })
    }
    
    comparer(o1: any, o2: any): boolean {
        // if possible compare by object's name, and not by reference.
        return o1.id == o2.id;
    }

    close(): void
    {
        // Close the dialog
        this.dialogRef.close();
    }
}
