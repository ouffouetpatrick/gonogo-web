import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { MetierEmploye } from 'app/interfaces/metier-employe/metierEmploye';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { MetierEmployeService } from 'app/services/metier-employe/metier-employe.service';
import { MetierFormComponent } from './metierForm/metierForm.component';

@Component({
    selector     : 'metier-employe',
    templateUrl  : './metier-employe.component.html',
    styleUrls: ['./metier-employe.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MetierEmployeComponent
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
    deleteMetierForm: FormGroup;
    
    //Données tableau
    dataSource = new MatTableDataSource<MetierEmploye>([]);

    constructor(
        private _metierEmployeService : MetierEmployeService,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
    ){}

    ngOnInit(): void {
        this.getMetier();
        this.generateConfirmForm();
    }

    getMetier(){
        this.isLoading = true; // Démarre le loader
        const getMetier = this._metierEmployeService.query({
            order: { id: 'DESC'},
            where: {geler: 0}
        });
        getMetier.subscribe((result) => {
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

    openDialogMetierForm(metier?: any): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(MetierFormComponent, {
            data: {
                metier: metier ? metier : undefined,
            }
        });
 
        // A la fermeture, retourner la liste des domaines d'activité
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getMetier();
            }
        });
    }

    generateConfirmForm() {
        this.deleteMetierForm = this._formBuilder.group({
            title: 'Suppression du metier',
            message:
                'Êtes-vous sûr de vouloir supprimer définitivement ce metier? <span class="font-medium">Cette action ne peut pas être annulée!</span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Supprimer',
                    color: 'warn',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Annuler',
                }),
            }),
            dismissible: true,
        });
    }

    deleteMetier(metier?: MetierEmploye){
        const dialogRef = this._fuseConfirmationService.open(
            this.deleteMetierForm.value
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const deleteReq = this._metierEmployeService.supprimerMetier(metier);
                deleteReq.subscribe(() => {
                    this.getMetier();
                });
            }
        });
    }
}
