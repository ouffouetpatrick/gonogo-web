import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { TypePiece } from 'app/interfaces/type-piece/typePiece';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { TypePieceService } from 'app/services/type-piece/type-piece.service';

@Component({
    selector     : 'type-piece-form',
    templateUrl  : './type-piece-form.component.html',
    styleUrls: ['./type-piece-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TypePieceFormComponent implements OnInit
{
    // Tableau et paginatnation
    displayedColumns: string[] = ['libelle', 'dateCreation', 'action'];
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    isLoading: boolean = false;

    typePieceForm : FormGroup;

    constructor(
        public matDialogRef: MatDialogRef<TypePieceFormComponent>,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _typePieceService : TypePieceService,
        // injecter les données provenant de la table parent ici
        @Inject(MAT_DIALOG_DATA) public data: { typePiece: TypePiece }
    ){}

    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(){
        this.typePieceForm = this._formBuilder.group({
            id: [this.data.typePiece ? this.data.typePiece.id : null],
            libelle: [this.data.typePiece ? this.data.typePiece.libelle : '', [Validators.required]],
            empty1: [null],
            empty2: [null],
            empty3: [null],
            geler: [0],
            dateCreation: [new Date().toISOString()],
            idusrcreation   : [1],
        });
    }

    save(): void {
        const typePiece: TypePiece = this.typePieceForm.value;
        const send = (!this.typePieceForm.value.id) ? this._typePieceService.save(typePiece) : this._typePieceService.update(this.typePieceForm.value);
    
        send.subscribe(async (result) => {
          if (result) {
            this._snackBar.open('Type pièce sauvegardé', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
            this.matDialogRef.close({ status: 'save' });
    
          } else {
            this._snackBar.open('Impossible d\'enregistrer le type pièce', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
          }
        },
          (err) => {
            this._snackBar.open('Erreur enregistrement  type pièce', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
          });
    }

    close(): void {
        this.matDialogRef.close();
    }

}
