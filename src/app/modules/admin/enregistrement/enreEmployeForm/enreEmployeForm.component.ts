import { Component, HostListener, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { UserService } from 'app/core/user/user.service';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';
import { Employe } from 'app/interfaces/employe/employe';
import { MetierEmploye } from 'app/interfaces/metier-employe/metierEmploye';
import { StatutMatrimonial } from 'app/interfaces/statut-matrimonial/statutMatrimonial';
import { TypePiece } from 'app/interfaces/type-piece/typePiece';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { EmployeService } from 'app/services/employe/employe.service';
import { MetierEmployeService } from 'app/services/metier-employe/metier-employe.service';
import { StatutMatrimonialService } from 'app/services/statut-matrimonial/statut-matrimonial.service';
import { TypePieceService } from 'app/services/type-piece/type-piece.service';
import { FileInput } from 'ngx-material-file-input';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'enreEmployeForm',
    templateUrl  : './enreEmployeForm.component.html',
    styleUrls: ['./enreEmployeForm.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EnreEmployeFormComponent implements OnInit
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

    employeForm: FormGroup;
    listStatutMatrimonial : StatutMatrimonial[] = [];
    listeTypePiece : TypePiece[] = [];
    listeMetier : MetierEmploye[] = [];
    employe: Employe; //Variable contenant employé retourné après find by Id
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: Utilisateur;
    currentDate : any = new Date();
    myfilename : String;

    constructor(
        private _formBuilder: FormBuilder,
        private _statutMatrimonialService : StatutMatrimonialService,
        private _typePieceService : TypePieceService,
        private _metierEmployeService : MetierEmployeService,
        private _employeService : EmployeService,
        private _activatedRoute: ActivatedRoute, //Capturer un element de l'url dans la route active
        private _router: Router, //Path, redirection
        private _snackBar: MatSnackBar,
        private _userService : UserService,
    ){}

    
    ngOnInit(): void {
        this.userConnecte();
        this.getIdInActiveRoute();
        this.generateEmployeForm();
        this.getStatutMatrimonial();
        this.getTypePiece();
        this.getMetier(); 
    }

    userConnecte(){
        this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: Utilisateur) => {
          this.user = user;                
      });
    }

    generateEmployeForm(){
        this.employeForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                id: [null],
                nom: [this.employe ? this.employe.nom : "", Validators.required],
                prenom: [this.employe ? this.employe.prenom : "", Validators.required],
                sexe: [this.employe ? this.employe.sexe : "", Validators.required],
                dateNaissance: [this.employe ? this.employe.dateNaissance : "", Validators.required],
            }),
            step2: this._formBuilder.group({
                statutMatrimonial: [this.employe ? this.employe.statutMatrimonial : "", Validators.required],
                nombreEnfant: [this.employe ? this.employe.nombreEnfant : ""],
                residencePermanent: [this.employe ? this.employe.residencePermanent : "", Validators.required],
                residenceActuel: [this.employe ? this.employe.residenceActuel : "", Validators.required],
            }),
            step3: this._formBuilder.group({
                typePiece: [this.employe ? this.employe.typePiece : "", Validators.required],
                numeroPiece: [this.employe ? this.employe.numeroPiece : "", [Validators.required, Validators.pattern('^[0-9]*$')]],
                contact1: [this.employe ? this.employe.contact1 : "", [Validators.required, Validators.pattern('^[0-9]*$')]],
                contact2: [this.employe ? this.employe.contact2 : "", Validators.pattern('^[0-9]*$')],
            }),
            step4: this._formBuilder.group({
                metierEmploye: [this.employe ? this.employe.metierEmploye : "", Validators.required],
                specialiteMetier: [this.employe ? this.employe.specialiteMetier : "", Validators.required],
                anneeExperiencePoste: [this.employe ? this.employe.anneeExperiencePoste : "", Validators.required],
                professionAnterieur: [this.employe ? this.employe.professionAnterieur : "", Validators.required],
                anneeExperiencePosteAnterieur: [this.employe ? this.employe.anneeExperiencePosteAnterieur : "", Validators.required],
                entreprise: [this.user.entreprise.id],
                empty1: [null],
                empty2: [null],
                empty3: [null],
                geler: [0],
                dateCreation: [new Date().toISOString()],
                idusrcreation: [this.user.id],
            })
        });
    }

    getStatutMatrimonial(){
        const getStatutMatrimonial = this._statutMatrimonialService.query({order: {id: 'DESC'}});
        getStatutMatrimonial.subscribe((result) => {
            this.listStatutMatrimonial = result;
            // console.log(this.listStatutMatrimonial,'listStatutMatrimonial');
        })
    }

    getTypePiece(){
        const getTypePiece = this._typePieceService.query({order: {id : 'DESC'}});
        getTypePiece.subscribe((result) => {
            this.listeTypePiece = result;
        })
    }

    getMetier(){
        const getMetier = this._metierEmployeService.query({order: {id : 'DESC'}});
        getMetier.subscribe((result) => {
            this.listeMetier = result;
        })
    }

    
    // saveEmploye(): void {
    //     const employe = {
    //         ...this.employeForm.value.step1,
    //         ...this.employeForm.value.step2, 
    //         ...this.employeForm.value.step3, 
    //         ...this.employeForm.value.step4,
    //     };
    //     const send = (!this.employeForm.value.id) ? this._employeService.ajouterEmploye(employe) : this._employeService.update(this.employeForm.value);
    //     const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/enregistrement';
    //     send.subscribe(async (result) => {
    //         this._snackBar.open('Opération réussie !', 'Fermer', { duration: 3000 }); // 3000 ms = 3 secondes
    //         this._router.navigateByUrl(redirectURL); 
    //     },
    //     (error) => {
    //         this._snackBar.open('Une erreur est survenue. Veuillez réessayer.', 'Fermer', { duration: 5000 });
    //     }
    //     );
    // }

    saveEmploye() {
        const employe = {
            ...this.employeForm.value.step1,
            ...this.employeForm.value.step2, 
            ...this.employeForm.value.step3, 
            ...this.employeForm.value.step4,
        };
        employe.typePiece = JSON.stringify(employe.typePiece);
        employe.statutMatrimonial = JSON.stringify(employe.statutMatrimonial);
        employe.metierEmploye = JSON.stringify(employe.metierEmploye);
        employe.entreprise = JSON.stringify(employe.entreprise);

        const fileForm: FileInput = this.employeForm.value.step4['empty1'];
        
        let send : any

        if (fileForm) {

            const fichier = fileForm.files[0];
      
            const formdata = new FormData();
            for (const key in employe) {
              if (Object.prototype.hasOwnProperty.call(employe, key)) {
                const value = employe[key];
                if(key !== 'image'){
                  formdata.append(key, value);
                }  
              }
            }
            formdata.append('image', fichier);
            send = this._employeService.ajouterEmploye(formdata);
            // send = (!this.employeForm.value.id) ? this._employeService.ajouterEmploye(formdata) : this._employeService.update(this.employeForm.value);
          }

        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/enregistrement';

        send.subscribe(async result => {
            // this.inProgress = false; // stop le loader
            if (result) {
              this._snackBar.open('Enregistrement effectué avec succès', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
              this._router.navigateByUrl(redirectURL);
            //   console.log(this.employeForm, 'this.employeForm');
            } else {
              this._snackBar.open('Impossible d\'enregistrer', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
            }
            },
            err => {
              this._snackBar.open('Erreur enregistrement employé', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
            });
    }

    fileChangeEvent(fileInput: any): void {

        if (fileInput.target.files && fileInput.target.files[0]) {
    
          this.myfilename = '';
          Array.from(fileInput.target.files).forEach((file: File) => {
            this.myfilename += file.name + ',';
          });
    
          const reader = new FileReader();
          reader.onload = (e: any): void => {
            const image = new Image();
            image.src = e.target.result;
            // image.onload = rs => {
            //   Return Base64 Data URL
            //   const imgBase64Path = e.target.result;
            // };
          };
          reader.readAsDataURL(fileInput.target.files[0]);
          // Reset File Input to Selct Same file again
          //   this.uploadFileInput.nativeElement.value = "";
        } else {
          this.myfilename = 'Select File';
        }
      }

    //Recuperer l'id dans la route active (url)
    getIdInActiveRoute(){
        this._activatedRoute.paramMap.subscribe(params => {
            const employeId = params.get('id');
            if(employeId){
                //get employé avec l'id trouvé
                this.getEmployeId(employeId);
            }
        });
    }

    // Rechercher l'element en fonction de l'id recupéré dans la route active (url)
    getEmployeId(employeId){
        //La recherche s'effectue dans la listeEmployes (données stockées dans listeEmployes au niveau de employeService)
        //employeService importé dans app.module afin d'être accessible partout, de ce fait listeEmployes
        //est accessible aussi partout. 
        this.employe = this._employeService.listeEmployes.find(element => element.id == employeId)
    }

    comparer(o1: any, o2: any): boolean {
        return o1.id == o2.id;
    }

}
