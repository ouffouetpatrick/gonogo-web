import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { StatutJuridique } from 'app/interfaces/statut-juridique/statutJuridique';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { StatutJuridiqueService } from 'app/services/statut-juridique/statut-juridique.service';

@Component({
    selector     : 'statut-juridique-form',
    templateUrl  : './statut-juridique-form.component.html',
    styleUrls: ['./statut-juridique-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StatutJuridiqueFormComponent implements OnInit
{
    // Tableau et paginatnation
    displayedColumns: string[] = ['libelle', 'dateCreation', 'action'];
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    isLoading: boolean = false;

    statutJuridiqueForm : FormGroup;

    constructor(
        public matDialogRef: MatDialogRef<StatutJuridiqueFormComponent>,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _statutJuridiqueService : StatutJuridiqueService,
        // injecter les données provenant de la table parent ici
        @Inject(MAT_DIALOG_DATA) public data: { statutJuridique: StatutJuridique }
    ){}

    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(){
        this.statutJuridiqueForm = this._formBuilder.group({
            id: [this.data.statutJuridique ? this.data.statutJuridique.id : null],
            libelle: [this.data.statutJuridique ? this.data.statutJuridique.libelle : '', [Validators.required]],
            empty1: [null],
            empty2: [null],
            empty3: [null],
            geler: [0],
            dateCreation: [new Date().toISOString()],
            idusrcreation   : [1],
        });
    }

    save(): void {
        const statutJuridique: StatutJuridique = this.statutJuridiqueForm.value;
        const send = (!this.statutJuridiqueForm.value.id) ? this._statutJuridiqueService.save(statutJuridique) : this._statutJuridiqueService.update(this.statutJuridiqueForm.value);
    
        send.subscribe(async (result) => {
          if (result) {
            this._snackBar.open('statut juridique sauvegardé', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
            this.matDialogRef.close({ status: 'save' });
    
          } else {
            this._snackBar.open('Impossible d\'enregistrer le statut juridique', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
          }
        },
          (err) => {
            this._snackBar.open('Erreur enregistrement  statut juridique', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
          });
    }

    close(): void {
        this.matDialogRef.close();
    }

}
