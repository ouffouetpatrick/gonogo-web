import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { UserService } from 'app/core/user/user.service';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';
import { Employe } from 'app/interfaces/employe/employe';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { EmployeService } from 'app/services/employe/employe.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'enregistrement',
    templateUrl  : './enregistrement.component.html',
    styleUrls: ['./enregistrement.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class EnregistrementComponent implements OnInit
{

    // Tableau et paginatnation
    displayedColumns: string[] = [
        'nom',
        'prenom',
        'sexe',
        'metier',
        'specialite',
        'contact',
        'action'
    ];
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    isLoading: boolean = false;
    dataSource = new MatTableDataSource<Employe>([]);
    updateFormLink : string = '/enregistrement/enreEmployeForm';
    detailPathLink : string = '/enregistrement/detailEmploye';
    deleteForm : FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: Utilisateur;

    constructor(
        private _employseService : EmployeService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _userService : UserService,
    ){}

    ngOnInit(): void {
        this.userConnecte();
        this.generateConfirmationForm();
    }

    userConnecte(){
        this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: Utilisateur) => {
            this.user = user;
            
            this.getEmploye();           
        });
    }

    // getEmploye() {
    //     this.isLoading = true; // Démarre le loader
    //     const getEmploye = this._employseService.getListeEmploye();
    //     getEmploye.subscribe((result) => {
    //         //Affecter result à listeEmployes, créé dans employseService afin d'être disponible partout
    //         this._employseService.listeEmployes = result;

    //         // Trier le résultat par ordre décroissant d'id
    //         result.sort((a, b) => b.id - a.id);

    //         //Ajouter le result au tableau
    //         this.isLoading = false; // stop le loader
    //         this.dataSource = new MatTableDataSource<any>(result);
    //         this.dataSource.paginator = this.paginator;
    //         this.dataSource.sort = this.sort;
    
    //         // pagination
    //         this.pagination.page = 1;
    //         this.pagination.startIndex = 0;
    //         this.pagination.length = result.length;
    //     });
    // }

    //Recuperer path
    
    getEmploye(): void {

        this.isLoading = true;

        let where: any;

        if (this.user.utilisateurProfil[0].profil.id == 2) {
            where = {
                entreprise: this.user.entreprise.id,
                geler: 0
            }; 
        } else if (this.user.utilisateurProfil[0].profil.id == 3 || this.user.utilisateurProfil[0].profil.id == 4) {
            where = {
                idusrcreation: this.user.id,
                geler: 0
            }; 
        } else {
            where = {
                geler: 0
            }
        }

        const getListeEmploye = this._employseService.query({
            where,
            order: {id: 'DESC'},
            relations: [ 
            'entreprise', 
            'typePiece',
            'statutMatrimonial',
            'metierEmploye',
            ],
        });

        getListeEmploye.subscribe(
            (result) => {
                console.log(result, 'resultListeEmployes');
                
                this._employseService.listeEmployes = result;

                this.isLoading = false;
                this.dataSource = new MatTableDataSource<any>(result);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
        
                // pagination
                this.pagination.page = 1;
                this.pagination.startIndex = 0;
                this.pagination.length = result.length;
            },
        );
    }
    
    updateFormPath(id){
        this._router.navigate([this.updateFormLink + '/' + id])
    }

    //Recuperer path
    detailPath(id){
        this._router.navigate([this.detailPathLink + '/' + id])
    }

    generateConfirmationForm() {
        this.deleteForm = this._formBuilder.group({
            title: 'Suppression employé',
            message:
                'Êtes-vous sûr de vouloir supprimer cet employé? <span class="font-medium">Cette action ne peut pas être annulée!</span>',
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
                    color: 'primary',
                }),
            }),
            dismissible: true,
        });
    }

    deleteEmploye(employe?: Employe){
        const dialogRef = this._fuseConfirmationService.open(this.deleteForm.value);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const deleteEmploye = this._employseService.supprimerEmploye(employe);
                deleteEmploye.subscribe(() => {
                    this.getEmploye()
                });
            }
        });
    }

}
