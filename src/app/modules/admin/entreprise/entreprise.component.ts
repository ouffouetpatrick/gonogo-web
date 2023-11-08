import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { Entreprise } from 'app/interfaces/entreprise/entreprise';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { EntrepriseService } from 'app/services/entreprise/entreprise.service';
import { EntrepriseFormComponent } from './entrepriseForm/entrepriseForm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';

@Component({
    selector     : 'entreprise',
    templateUrl  : './entreprise.component.html',
    styleUrls: ['./entreprise.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EntrepriseComponent implements OnInit
{
    
    // Tableau et paginatnation
    displayedColumns: string[] = [
        'nom',
        'contact',
        'localisation',
        'domaineActivite',
        'statutJuridique',
        'dateCreation',
        'action'
    ];
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    isLoading: boolean = false;

    //Données tableau
    entrprise: Entreprise[];
    dataSource = new MatTableDataSource<Entreprise>([]);

    deleteEntrepriseForm : FormGroup;

    constructor(
        private entrepriseService: EntrepriseService,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _entrepriseService : EntrepriseService,
    )
    {}

    ngOnInit(): void {
        this.getEntreprise();
        this.generateConfirmForm();
    }

    getEntreprise(): void {
        this.isLoading = true; // Démarre le loader
        const getEntreprise = this.entrepriseService.getListeEntreprise();
        getEntreprise.subscribe((result) => {
            this.entrprise = result;
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

    openDialogEntrepriseForm(entreprise?: any): void {
        const dialogRef = this._matDialog.open(EntrepriseFormComponent, {
            data: {
                entreprise: entreprise ? entreprise : undefined,
            },
        });
        
        // Après la fermeture du formulaire, si une donnée a été inserée, recuperer 
        // la liste des entreprises. 
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getEntreprise()
            }
        });
    }

    generateConfirmForm() {
        this.deleteEntrepriseForm = this._formBuilder.group({
            title: 'Suppression de l\'entreprise',
            message:
                'Êtes-vous sûr de vouloir supprimer définitivement cette entreprise? <span class="font-medium">Cette action ne peut pas être annulée!</span>',
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

    deleteEntreprise(entreprise?: Entreprise){
        const dialogRef = this._fuseConfirmationService.open(
            this.deleteEntrepriseForm.value
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const deleteReq = this.entrepriseService.supprimerEntreprise(entreprise);
                deleteReq.subscribe(() => {
                    this.getEntreprise()
                });
            }
        });
    }
}
