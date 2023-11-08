import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { TypePiece } from 'app/interfaces/type-piece/typePiece';
import { TypePieceService } from 'app/services/type-piece/type-piece.service';
import { TypePieceFormComponent } from './type-piece-form/type-piece-form.component';

@Component({
    selector     : 'type-piece',
    templateUrl  : './type-piece.component.html',
    styleUrls: ['./type-piece.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TypePieceComponent
{
    // Tableau et paginatnation
    displayedColumns: string[] = [
        'libelle',
        'dateCreation',
        'action'
    ];
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    isLoading: boolean = false;

    //Données tableau
    dataSource = new MatTableDataSource<TypePiece>([]);

    constructor(
        private _typePieceService : TypePieceService,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
    ){}

    ngOnInit(): void {
        this.getTypePiece();
    }

    getTypePiece(): void {

        this.isLoading = true; // Démarre le loader
        const getTypePiece = this._typePieceService.query({order: { id: 'DESC'}});
        getTypePiece.subscribe((result) => {
            this.isLoading = false; // stop le loader
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            // pagination
            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length; 
        });
    }

    openDialogTypePieceForm(typePiece?: any): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(TypePieceFormComponent, {
            data: {
                typePiece: typePiece ? typePiece : undefined,
            }
        });

        // A la fermeture, retourner la liste des domaines d'activité
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getTypePiece();
            }
        });
    }
}
