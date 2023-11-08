import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { DomaineActivite } from 'app/interfaces/domaine-activite/domaineActivite';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { DomaineActiviteService } from 'app/services/domaine-activite/domaineActivite.service';
import { DomaineActiviteFormComponent } from './domaineActiviteForm/domaine-activite-form.component';

@Component({
    selector     : 'domaine-activite',
    templateUrl  : './domaine-activite.component.html',
    styleUrls: ['./domaine-activite.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DomaineActiviteComponent implements OnInit
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
    dataSource = new MatTableDataSource<DomaineActivite>([]);

    constructor(
        private _domaineActiviteService : DomaineActiviteService,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
    ){}

    ngOnInit(): void {
        this.getDomaineActivite();
    }

    getDomaineActivite(){

        this.isLoading = true; // Démarre le loader
        const getDomaineActivite = this._domaineActiviteService.query({order: { id: 'DESC'}});
        getDomaineActivite.subscribe((result) => {
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

    openDialogDomaineActiviteForm(domaineActivite?: any): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(DomaineActiviteFormComponent, {
            data: {
            domaineActivite: domaineActivite ? domaineActivite : undefined,
            }
        });
 
        // A la fermeture, retourner la liste des domaines d'activité
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getDomaineActivite();
            }
        });
    }
}
