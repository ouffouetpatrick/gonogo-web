import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { DomaineActivite } from 'app/interfaces/domaine-activite/domaineActivite';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { DomaineActiviteService } from 'app/services/domaine-activite/domaineActivite.service';

@Component({
    selector     : 'domaine-activite-form',
    templateUrl  : './domaine-activite-form.component.html',
    styleUrls: ['./domaine-activite-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DomaineActiviteFormComponent implements OnInit
{
    // Tableau et paginatnation
    displayedColumns: string[] = ['libelle', 'dateCreation', 'action'];
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    isLoading: boolean = false;

    domaineActiviteForm : FormGroup;

    constructor(
        public matDialogRef: MatDialogRef<DomaineActiviteFormComponent>,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _domaineActiviteService : DomaineActiviteService,
        // injecter les données provenant de la table parent ici
        @Inject(MAT_DIALOG_DATA) public data: { domaineActivite: DomaineActivite }
    ){}

    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(){
        this.domaineActiviteForm = this._formBuilder.group({
            id: [this.data.domaineActivite ? this.data.domaineActivite.id : null],
            libelle: [this.data.domaineActivite ? this.data.domaineActivite.libelle : '', [Validators.required]],
            empty1: [null],
            empty2: [null],
            empty3: [null],
            geler: [0],
            dateCreation: [new Date().toISOString()],
            idusrcreation   : [1],
        });
    }

    save(): void {
        const domaineActivite: DomaineActivite = this.domaineActiviteForm.value;
        const send = (!this.domaineActiviteForm.value.id) ? this._domaineActiviteService.save(domaineActivite) : this._domaineActiviteService.update(this.domaineActiviteForm.value);
    
        send.subscribe(async (result) => {
          if (result) {
            this._snackBar.open('domaineActivite sauvegardé', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
            this.matDialogRef.close({ status: 'save' });
    
          } else {
            this._snackBar.open('Impossible d\'enregistrer le domaineActivite', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
          }
        },
          (err) => {
            this._snackBar.open('Erreur enregistrement  domaineActivite', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
          });
    }

    close(): void {
        this.matDialogRef.close();
    }

}
