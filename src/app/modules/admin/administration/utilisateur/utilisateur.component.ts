
import { UtilisateurService } from "./../../../../services/administration/utilisateur.service";
import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    AfterViewInit,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { MatTableDataSource } from "@angular/material/table";
import { UtilisateurFormComponent } from "./utilisateurForm/utilisateurForm.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { FormControl } from '@angular/forms';
import { Utilisateur } from "app/interfaces/administration/utilisateur";
import { UserService } from "app/core/user/user.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-utilisateur",
    templateUrl: "./utilisateur.component.html",
    styleUrls: ["./utilisateur.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UtilisateurComponent implements OnInit, AfterViewInit {

    dataSource = new MatTableDataSource<Utilisateur>();
    dialogRef: any;
    
    utilisateurs: Utilisateur[];

    isLoading: boolean = false;
    pagination: Pagination = {page: 1, size: 10, startIndex: 0};
    searchInputControl: FormControl = new FormControl();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: Utilisateur;

    constructor(
        public dialog: MatDialog,
        private utilisateurService: UtilisateurService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _userService : UserService,
    ) {}

    ngOnInit(): void {
        this.userConnecte();
        this.getUtilisateur();
    }

    userConnecte(){
        this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: Utilisateur) => {
            this.user = user;
        });
    }

    openDialogutilisateurForm(utilisateur: Utilisateur) {
        const dialogRef = this.dialog.open(UtilisateurFormComponent, {
            panelClass: "utilisateurForm-dialog",
            data: {
                utilisateur: utilisateur ? utilisateur : undefined,
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result.status == "save"){
                this.getUtilisateur()
            }
        });
    }

    deleteOne(): void {

        // Open the confirmation and save the reference
        const dialogRef = this._fuseConfirmationService.open({
            title: "Voulez-vous supprimer ?",
            icon: {
                show: true,
                name: "heroicons_outline:question-mark-circle",
                color:'warning'
            }
        });

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {

            }else{

            }
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getUtilisateur() {

        this.isLoading = true; // Démarre le loader

        let where: any;

        if (this.user.utilisateurProfil[0].profil.id == 2) {
            where = {
                idusrcreation: this.user.id,
            }; 
        } else {
            where = {
                geler: 0
            }
        }

        const getUtilisateur = this.utilisateurService.query({
            where,
            order: { id: "DESC"},
            relations:[
                "utilisateurProfil",
                "utilisateurModuleDroit",
                "utilisateurProfil.profil",
                "entreprise"
            ]
        });
    
        getUtilisateur.subscribe(result => {
            this.isLoading = false; // stop le loader
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
     trackByFn(index: number, item: any): any
     {
         return item.id || index;
     }
 
     pageChanged(event) {
         console.log("event", event);
         let pageIndex = event.pageIndex;
         let previousIndex = event.previousPageIndex;
         this.pagination.startIndex = pageIndex;
         this.pagination.page = pageIndex+1;
         this.pagination.size = event.pageSize;
     }
}