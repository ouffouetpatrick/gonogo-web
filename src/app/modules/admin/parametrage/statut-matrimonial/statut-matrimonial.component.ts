import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { StatutMatrimonial } from 'app/interfaces/statut-matrimonial/statutMatrimonial';
import { StatutMatrimonialService } from 'app/services/statut-matrimonial/statut-matrimonial.service';
import { StatutMatrimonialFormComponent } from './statut-matrimonial-form/statut-matrimonial-form.component';

@Component({
    selector     : 'statut-matrimonial',
    templateUrl  : './statut-matrimonial.component.html',
    styleUrls: ['./statut-matrimonial.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StatutMatrimonialComponent
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
    dataSource = new MatTableDataSource<StatutMatrimonial>([]);

    constructor(
        private _statutMatrimonialService : StatutMatrimonialService,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
    ){}

    ngOnInit(): void {
        this.getStatutMatrimonial();
    }

    getStatutMatrimonial(){

        this.isLoading = true; // Démarre le loader
        const getStatutMatrimonial = this._statutMatrimonialService.query({order: { id: 'DESC'}});
        getStatutMatrimonial.subscribe((result) => {
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

    openDialogStatutMatrimonialForm(statutMatrimonial?: any): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(StatutMatrimonialFormComponent, {
            data: {
                statutMatrimonial: statutMatrimonial ? statutMatrimonial : undefined,
            }
        });
 
        // A la fermeture, retourner la liste des domaines d'activité
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getStatutMatrimonial();
            }
        });
    }
}
