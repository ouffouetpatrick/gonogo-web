import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { StatutMatrimonial } from 'app/interfaces/statut-matrimonial/statutMatrimonial';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { StatutMatrimonialService } from 'app/services/statut-matrimonial/statut-matrimonial.service';

@Component({
    selector     : 'statut-matrimonial-form',
    templateUrl  : './statut-matrimonial-form.component.html',
    styleUrls: ['./statut-matrimonial-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StatutMatrimonialFormComponent implements OnInit
{
    // Tableau et paginatnation
    displayedColumns: string[] = ['libelle', 'dateCreation', 'action'];
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    isLoading: boolean = false;

    statutMatrimonialForm : FormGroup;

    constructor(
        public matDialogRef: MatDialogRef<StatutMatrimonialFormComponent>,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _statutMatrimonialService : StatutMatrimonialService,
        // injecter les données provenant de la table parent ici
        @Inject(MAT_DIALOG_DATA) public data: { statutMatrimonial: StatutMatrimonial }
    ){}

    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(){
        this.statutMatrimonialForm = this._formBuilder.group({
            id: [this.data.statutMatrimonial ? this.data.statutMatrimonial.id : null],
            libelle: [this.data.statutMatrimonial ? this.data.statutMatrimonial.libelle : '', [Validators.required]],
            empty1: [null],
            empty2: [null],
            empty3: [null],
            geler: [0],
            dateCreation: [new Date().toISOString()],
            idusrcreation   : [1],
        });
    }

    save(): void {
        const statutMatrimonial: StatutMatrimonial = this.statutMatrimonialForm.value;
        const send = (!this.statutMatrimonialForm.value.id) ? this._statutMatrimonialService.save(statutMatrimonial) : this._statutMatrimonialService.update(this.statutMatrimonialForm.value);
    
        send.subscribe(async (result) => {
          if (result) {
            this._snackBar.open('Statut matrimonial sauvegardé', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
            this.matDialogRef.close({ status: 'save' });
    
          } else {
            this._snackBar.open('Impossible d\'enregistrer le statut matrimonial', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
          }
        },
          (err) => {
            this._snackBar.open('Erreur enregistrement statut matrimonial', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
          });
    }

    close(): void {
        this.matDialogRef.close();
    }

}
