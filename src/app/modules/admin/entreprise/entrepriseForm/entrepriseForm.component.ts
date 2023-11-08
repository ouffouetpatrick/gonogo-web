import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomaineActivite } from 'app/interfaces/domaine-activite/domaineActivite';
import { Entreprise } from 'app/interfaces/entreprise/entreprise';
import { StatutJuridique } from 'app/interfaces/statut-juridique/statutJuridique';
import { DomaineActiviteService } from 'app/services/domaine-activite/domaineActivite.service';
import { EntrepriseService } from 'app/services/entreprise/entreprise.service';
import { StatutJuridiqueService } from 'app/services/statut-juridique/statut-juridique.service';

@Component({
    selector     : 'entrepriseForm',
    templateUrl  : './entrepriseForm.component.html',
    styleUrls: ['./entrepriseForm.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EntrepriseFormComponent implements OnInit
{

    entrepriseForm : FormGroup;
    listeDomaineActivite: DomaineActivite[] = [];
    listeStatutJuridique: StatutJuridique[] = [];

    constructor(
        public matDialogRef: MatDialogRef<EntrepriseFormComponent>,
        private _formBuilder: FormBuilder,
        //Injecter les données(data) qui viennent depuis component parent 
        //dans le component enfant (utilisé dans entrepriseForm)
        @Inject(MAT_DIALOG_DATA) public data: { entreprise: Entreprise },
        private _entrepriseService : EntrepriseService,
        private _domaineActiviteService : DomaineActiviteService,
        private _statutJuridiqueService : StatutJuridiqueService,
        private _snackBar: MatSnackBar,
    ){}


    ngOnInit(): void {
        this.getDomaineActivite();
        this.getStatutJuridique();
        this.generateEntrepriseForm();
    }

    getDomaineActivite() {
        const getDomaineActivite = this._domaineActiviteService.query({order: { id: 'DESC'}});
        getDomaineActivite.subscribe((result) => {
            this.listeDomaineActivite = result;
        });
    }

    getStatutJuridique() {
        const getStatutJuridique = this._statutJuridiqueService.query({order: { id: 'DESC'}});
        getStatutJuridique.subscribe((result) => {
            this.listeStatutJuridique = result;
        });
    }

    generateEntrepriseForm(){

        //Verifier que les caratères sont que des lettres
        // function lettersOnlyValidator(control: AbstractControl): ValidationErrors | null {
        //     const nom = control.value;
        //     if (nom && !/^[A-Za-z]+$/.test(nom)) {
        //       return { lettersOnly: true };
        //     }
        //     return null;
        //   }

        this.entrepriseForm = this._formBuilder.group({
            id: [this.data.entreprise ? this.data.entreprise.id : null],
            nom: [this.data.entreprise ? this.data.entreprise.nom : '', [Validators.required]],
            contact: [this.data.entreprise ? this.data.entreprise.contact : '', [Validators.minLength(10), Validators.maxLength(10)]],
            localisation: [this.data.entreprise ? this.data.entreprise.localisation : '', [Validators.required]],
            empty1: [null],
            empty2: [null],
            empty3: [null],
            geler: [0],
            dateCreation: [new Date().toISOString()],
            idusrcreation: [1],//id de l'utilisateur connecté
            domaineActivite: [this.data.entreprise ? this.data.entreprise.domaineActivite : '', [Validators.required]],
            statutJuridique: [this.data.entreprise ? this.data.entreprise.statutJuridique : '', [Validators.required]],
        });
    }

    saveEntreprise(): void {
        const entreprise: Entreprise = this.entrepriseForm.value;
        const send = (!this.entrepriseForm.value.id) ? this._entrepriseService.ajouterEntreprise(entreprise) : this._entrepriseService.update(this.entrepriseForm.value);
        send.subscribe(async (result) => {
          if (result) {
            this._snackBar.open('Entreprise enregistrée', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
            this.matDialogRef.close({ status: 'save' });
    
          } else {
            this._snackBar.open('Impossible d\'enregistrer la entreprise', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
          }
        },
          (err) => {
            this._snackBar.open('Erreur enregistrement  entreprise', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
          });
      }

    close(): void {
        this.matDialogRef.close();
    }

    comparer(o1: any, o2: any): boolean {
        // if possible compare by object's name, and not by reference.
        return o1.id == o2.id;
    }
}
