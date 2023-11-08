import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { MetierEmploye } from 'app/interfaces/metier-employe/metierEmploye';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { MetierEmployeService } from 'app/services/metier-employe/metier-employe.service';

@Component({
    selector     : 'metierForm',
    templateUrl  : './metierForm.component.html',
    styleUrls: ['./metierForm.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MetierFormComponent implements OnInit
{
    // Tableau et paginatnation
    displayedColumns: string[] = ['libelle', 'dateCreation', 'action'];
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    isLoading: boolean = false;

    metierForm : FormGroup;

    constructor(
        public matDialogRef: MatDialogRef<MetierFormComponent>,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _metierEmployeService : MetierEmployeService,
        // injecter les données provenant de la table parent ici
        @Inject(MAT_DIALOG_DATA) public data: { metier: MetierEmploye }
    ){}

    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(){
        this.metierForm = this._formBuilder.group({
            id: [this.data.metier ? this.data.metier.id : null],
            libelle: [this.data.metier ? this.data.metier.libelle : '', [Validators.required]],
            empty1: [null],
            empty2: [null],
            empty3: [null],
            geler: [0],
            dateCreation: [new Date().toISOString()],
            idusrcreation   : [1],
        });
    }

    save(): void {
        const metier: MetierEmploye = this.metierForm.value;
        const send = (!this.metierForm.value.id) ? this._metierEmployeService.save(metier) : this._metierEmployeService.update(this.metierForm.value);
    
        send.subscribe(async (result) => {
          if (result) {
            this._snackBar.open('metier sauvegardé', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
            this.matDialogRef.close({ status: 'save' });
    
          } else {
            this._snackBar.open('Impossible d\'enregistrer le metier', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
          }
        },
          (err) => {
            this._snackBar.open('Erreur enregistrement  metier', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
          });
    }

    close(): void {
        this.matDialogRef.close();
    }

}
