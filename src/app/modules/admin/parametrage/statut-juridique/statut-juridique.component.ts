import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { StatutJuridiqueFormComponent } from './statut-juridique-form/statut-juridique-form.component';
import { StatutJuridiqueService } from 'app/services/statut-juridique/statut-juridique.service';
import { StatutJuridique } from 'app/interfaces/statut-juridique/statutJuridique';

@Component({
    selector     : 'statut-juridique',
    templateUrl  : './statut-juridique.component.html',
    styleUrls: ['./statut-juridique.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StatutJuridiqueComponent
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
    dataSource = new MatTableDataSource<StatutJuridique>([]);

    constructor(
        private _statutJuridiqueService : StatutJuridiqueService,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
    ){}

    ngOnInit(): void {
        this.getStatutJuridique();
    }

    getStatutJuridique(){

        this.isLoading = true; // Démarre le loader
        const getStatutJuridique = this._statutJuridiqueService.query({order: { id: 'DESC'}});
        getStatutJuridique.subscribe((result) => {
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

    openDialogStatutJuridiqueForm(statutJuridique?: any): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(StatutJuridiqueFormComponent, {
            data: {
                statutJuridique: statutJuridique ? statutJuridique : undefined,
            }
        });

        // A la fermeture, retourner la liste des domaines d'activité
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getStatutJuridique();
            }
        });
    }
}
