import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { Entreprise } from 'app/interfaces/entreprise/entreprise';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { EntrepriseService } from 'app/services/entreprise/entreprise.service';
import moment from 'moment';
import { MetierEmployeService } from 'app/services/metier-employe/metier-employe.service';
import { MetierEmploye } from 'app/interfaces/metier-employe/metierEmploye';
import { EmployeService } from 'app/services/employe/employe.service';
import { MatTableDataSource } from '@angular/material/table';
import { GestionEtatService } from 'app/services/gestion-etat/gestion-etat.service';
import { UtilisateurService } from 'app/services/administration/utilisateur.service';
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';
import * as XLSX from 'xlsx';
import { TDocumentDefinitions } from 'pdfmake/build/pdfmake';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector     : 'gestion-etat',
    styleUrls : ['./gestion-etat.component.scss'],
    templateUrl  : './gestion-etat.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GestionEtatComponent implements OnInit, AfterViewInit{

    SearchJourform: FormGroup;
    SearchSemaineform: FormGroup;
    SearchMoisform: FormGroup;
    SearchAnneeform: FormGroup;
    mois: any[] = [
        {
            id: 1,
            name: 'Janvier',
        },
        {
            id: 2,
            name: 'Février',
        },
        {
            id: 3,
            name: 'Mars',
        },
        {
            id: 4,
            name: 'Avril',
        },
        {
            id: 5,
            name: 'Mai',
        },
        {
            id: 6,
            name: 'Juin',
        },
        {
            id: 7,
            name: 'Juillet',
        },
        {
            id: 8,
            name: 'Août',
        },
        {
            id: 9,
            name: 'Septembre',
        },
        {
            id: 10,
            name: 'Octobre',
        },
        {
            id: 11,
            name: 'Novembre',
        },
        {
            id: 12,
            name: 'Décembre',
        },
    ];
    annees: any[] = [];
    ListeSemaineGeneral: any[] = [];
    ListeAnneeGeneral: any[] = [];
    currentWeek: number;
    selectValue: String;
    checked : string = 'Jour';
    recensementControle = new FormControl();
    displayedColumns: string[] = [
        'nom',
        'prenom',
        'sexe',
        'metier',
        'specialite',
        'contact',
        'dateCreation'
    ];
    dataSourceDay = new MatTableDataSource<any>([]);
    dataSourceWeek = new MatTableDataSource<any>([]);
    dataSourceMonth = new MatTableDataSource<any>([]);
    dataSourceYear = new MatTableDataSource<any>([]);
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    isLoading: boolean = false;
    entreprises: Entreprise [];
    metiers : MetierEmploye [];
    agent : any [] = [];
    agents : Utilisateur [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: Utilisateur;
    employeExportation : any[];
    currentDate : any = new Date();
    fileName: any = 'Liste_employe' + moment(new Date()).format('DD-MM-YYYY') + '.xlsx';

    constructor(
        private _formBuilder: FormBuilder,
        private _gestionEtatService : GestionEtatService,
        private _entrepriseService: EntrepriseService,
        private _metierEmployeService : MetierEmployeService,
        private _employeService : EmployeService,
        private _utilisateurService: UtilisateurService,
        private _userService : UserService,
    ){}

    ngOnInit(): void {
        this.userConnecte();
        this.initFormMois();
        this.initFormSemaine();
        this.initFormJour();
        this.initFormAnnee();
        this.getListeEntreprise();
        this.getListeMetier();
        this.getListeAgent();
        this.remplirTableauAnneeEtJour();
    }

    remplirTableauAnneeEtJour(){

        const dateActuel = new Date();
        const currentYear = dateActuel.getFullYear();

        // rempli le tableau des année pour la recherche annuelle
        for (var i = currentYear; i >= 2000; i--) {
            let el = {
                id: i,
                name: `${i}`,
            };
            this.annees.push(el);
            this.ListeAnneeGeneral.push(el);
        }

        // rempli le tableau des semaines pour la recherche hebdomadaire
        for (let j = 1; j <= 52; j++) {
            let element = { IdSemaine: j, NomSemaine: `${j}` };

            this.ListeSemaineGeneral.push(element);
        }
    }

    ngAfterViewInit(): void {
        this.getCurrentWeek();
    }

    userConnecte(){
        this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: Utilisateur) => {
            this.user = user;
        });
    }

    initFormJour(): void {
        if(this.user.utilisateurProfil[0].profil.id == 1){
            this.SearchJourform = this._formBuilder.group({
                dateJour: [new Date()],
                entreprise: ['All'],
                metier: ['All'],
                agent: ['All'],
            });
        } 
        if(this.user.utilisateurProfil[0].profil.id == 2){
            this.SearchJourform = this._formBuilder.group({
                dateJour: [new Date()],
                entreprise: [this.user.entreprise.id],
                metier: ['All'],
                agent: ['All'],
            });
        } 
        if(this.user.utilisateurProfil[0].profil.id == 3){
            this.SearchJourform = this._formBuilder.group({
                dateJour: [new Date()],
                entreprise: [this.user.entreprise.id],
                metier: ['All'],
                agent: [this.user.id],
            });
        } 
    }

    initFormSemaine(): void {
        this.getCurrentWeek();
        const year = new Date().getFullYear();
        const debut_debut = moment()
            .day('Monday')
            .year(year)
            .week(this.currentWeek);
        const debut_fin = debut_debut.clone().weekday(7);

        if(this.user.utilisateurProfil[0].profil.id == 1){
            this.SearchSemaineform = this._formBuilder.group({
                dateDebut: [debut_debut.toISOString()],
                dateFin: [debut_fin.toISOString()],
                semaine: [''],
                annee: [year],
                entreprise: ['All'],
                metier: ['All'],
                agent: ['All'],
            });
        }
        if(this.user.utilisateurProfil[0].profil.id == 2){
            this.SearchSemaineform = this._formBuilder.group({
                dateDebut: [debut_debut.toISOString()],
                dateFin: [debut_fin.toISOString()],
                semaine: [''],
                annee: [year],
                entreprise: [this.user.entreprise.id],
                metier: ['All'],
                agent: ['All'],
            });
        }
        if(this.user.utilisateurProfil[0].profil.id == 3){
            this.SearchSemaineform = this._formBuilder.group({
                dateDebut: [debut_debut.toISOString()],
                dateFin: [debut_fin.toISOString()],
                semaine: [''],
                annee: [year],
                entreprise: [this.user.entreprise.id],
                metier: ['All'],
                agent: [this.user.id],
            });
        }
        
    }

    getCurrentWeek(): void {
        // retourne le numéro de la semaine dans laquelle on se trouce
        function getWeekNumber(date): any {
            // Copy date so don't modify original
            date = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            );
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
            // Get first day of year
            let yearStart: any = new Date(
                Date.UTC(date.getUTCFullYear(), 0, 1)
            );
            // Calculate full weeks to nearest Thursday
            let weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
            // Return array of year and week number
            return weekNo;
        }

        this.currentWeek = getWeekNumber(new Date());

        this.ListeSemaineGeneral.map((item) => {
            if (item.IdSemaine === this.currentWeek) {
                this.SearchSemaineform.patchValue({ semaine: item.IdSemaine });
            }
        });
    }

    initFormMois(): void {
        this.getCurrentWeek();
        const year = new Date().getFullYear();
        const debut_debut = moment()
            .day('Monday')
            .year(year)
            .week(this.currentWeek);
        const debut_fin = debut_debut.clone().weekday(7);

        if(this.user.utilisateurProfil[0].profil.id == 1){
            this.SearchMoisform = this._formBuilder.group({
                mois: [1],
                annee: [year],
                entreprise: ['All'],
                metier: ['All'],
                agent: ['All'],
            });
        }
        if(this.user.utilisateurProfil[0].profil.id == 2){
            this.SearchMoisform = this._formBuilder.group({
                mois: [1],
                annee: [year],
                entreprise: [this.user.entreprise.id],
                metier: ['All'],
                agent: ['All'],
            });
        }
        if(this.user.utilisateurProfil[0].profil.id == 3){
            this.SearchMoisform = this._formBuilder.group({
                mois: [1],
                annee: [year],
                entreprise: [this.user.entreprise.id],
                metier: ['All'],
                agent: [this.user.id],
            });
        }

    }

    initFormAnnee(): void {
        this.getCurrentWeek();
        const year = new Date().getFullYear();
        const debut_debut = moment()
            .day('Monday')
            .year(year)
            .week(this.currentWeek);
        const debut_fin = debut_debut.clone().weekday(7);

        if(this.user.utilisateurProfil[0].profil.id == 1){
            this.SearchAnneeform = this._formBuilder.group({
                annee: [year],
                entreprise: ['All'],
                metier: ['All'],
                agent: ['All'],
            });
        }
        if(this.user.utilisateurProfil[0].profil.id == 2){
            this.SearchAnneeform = this._formBuilder.group({
                annee: [year],
                entreprise: [this.user.entreprise.id],
                metier: ['All'],
                agent: ['All'],
            });
        }
        if(this.user.utilisateurProfil[0].profil.id == 3){
            this.SearchAnneeform = this._formBuilder.group({
                annee: [year],
                entreprise: [this.user.entreprise.id],
                metier: ['All'],
                agent: [this.user.id],
            });
        }
    }

    getNewWeekDayInterval(annee, semaine = this.currentWeek): void {
        const newMoment = moment().set('year', annee);
        const dateDebut = moment()
            .day('Monday')
            .year(this.SearchSemaineform.value['annee'])
            .week(this.SearchSemaineform.value['semaine']);
        const dateFin = dateDebut.clone().weekday(7);

        this.SearchSemaineform.patchValue({
            dateDebut: dateDebut.toISOString(),
            dateFin: dateFin.toISOString(),
        });
    }

    getListeEntreprise(){
        this.isLoading = true;
        const getListeEntreprise = this._entrepriseService.getListeEntreprise();
        getListeEntreprise.subscribe((result) => {
            this.isLoading = false;
            this.entreprises = [{id: 'All', nom: 'Tous'}, ...result];
        });
    }

    getListeMetier(){
        this.isLoading = true;
        const getListeEntreprise = this._metierEmployeService.query({
            order: { id: 'DESC'},
            where : { geler: 0}
        });
        getListeEntreprise.subscribe((result) => {
            this.isLoading = false;
            this.metiers = [{ id: 'All', libelle: 'Tous' }, ...result];
        })
    }

    getListeAgent() {

        this.isLoading = true;

        const getAgent = this._utilisateurService.query({
            relations:[
                "utilisateurProfil",
                "utilisateurModuleDroit",
                "utilisateurProfil.profil",
                "entreprise"
            ],
            where : {entreprise: this.user.entreprise?.id},
            order: { id: "DESC"},
        });
    
        getAgent.subscribe((result: Utilisateur[]) => {
            this.isLoading = false;
            const liste = result.map((ag) => {
                const x = {
                    ...ag,
                    utilisateurProfil: ag.utilisateurProfil.length > 1 ? ag.utilisateurProfil.sort((a, b) => b.id - a.id) : ag.utilisateurProfil
                };

                if(x.utilisateurProfil[0].profil.id === 3){
                    this.agent.push(x);
                }

                this.agents = [{ id: 'All', nom: 'Tous' }, ...this.agent];
                
                return x;
            });
        });
    }

    //RECHERCHE JOURNALIERE
    searchFilterJournalier(): void {
        const getEmployeRecherchee = this._employeService.getEmployeRechercheeByDay({
                dateJour: this.SearchJourform.value['dateJour'],
                entreprise: this.SearchJourform.value['entreprise'],
                metier: this.SearchJourform.value['metier'],
                agent: this.SearchJourform.value['agent'],
            });

            getEmployeRecherchee.subscribe((result) => {
            this.employeExportation = result;
            this.dataSourceDay = new MatTableDataSource<any>(result);
            this.dataSourceDay.paginator = this.paginator;
            this.dataSourceDay.sort = this.sort;
            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
    }

    //RECHERCHE HEBDOMADAIRE
    searchFilterHebdomadaire(): void {
        const getEmployeRecherchee = this._employeService.getEmployeRechercheeByWeek({
                dateDebut: this.SearchSemaineform.value['dateDebut'],
                dateFin: this.SearchSemaineform.value['dateFin'],
                entreprise: this.SearchSemaineform.value['entreprise'],
                metier: this.SearchSemaineform.value['metier'],
                agent: this.SearchSemaineform.value['agent'],
            });

            getEmployeRecherchee.subscribe((result) => {
            this.isLoading = false;
            this.employeExportation = result;
            this.dataSourceWeek = new MatTableDataSource<any>(result);
            this.dataSourceWeek.paginator = this.paginator;
            this.dataSourceWeek.sort = this.sort;
            // pagination
            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
    }

    //RECHERCHE MENSUELLE
    searchFilterMensuel(): void {
        const getEmployeRecherchee = this._employeService.getEmployeRechercheeByMonth({
                mois: this.SearchMoisform.value['mois'],
                annee: this.SearchMoisform.value['annee'],
                entreprise: this.SearchMoisform.value['entreprise'],
                metier: this.SearchMoisform.value['metier'],
                agent: this.SearchMoisform.value['agent'],
            });

        getEmployeRecherchee.subscribe((result) => {
            this.isLoading = false;
            this.employeExportation = result;
            this.dataSourceMonth = new MatTableDataSource<any>(result);
            this.dataSourceMonth.paginator = this.paginator;
            this.dataSourceMonth.sort = this.sort;
            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
    }

    //RECHERCHE ANNUELLE
    searchFilterAnnuel(): void {
        const getEmployeRecherchee = this._employeService.getEmployeRechercheeByYear({
                annee: this.SearchAnneeform.value['annee'],
                entreprise: this.SearchAnneeform.value['entreprise'],
                metier: this.SearchAnneeform.value['metier'],
                agent: this.SearchAnneeform.value['agent'],
            });

            getEmployeRecherchee.subscribe((result) => {
            this.isLoading = false;
            this.employeExportation = result;
            this.dataSourceYear = new MatTableDataSource<any>(result);
            this.dataSourceYear.paginator = this.paginator;
            this.dataSourceYear.sort = this.sort;
            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
    }

    moisCompletFrench = function (NbreMois) {
        // initializing an array
        const months = [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre',
        ];
        return months[NbreMois];
    };

    exportPdf() {
        // Determination des elements chosis pour effectuer la recherche
        // en fonction du type de recherche choisi (journalier, hebdomadaire, mensuel et annuel)
        var PeriodeEtat = null;

        const getLogo = this._gestionEtatService.getLogo();

        getLogo.subscribe(
            (result) => {
                const logo = result.logo_onad;

                PeriodeEtat = null;

                switch (this.recensementControle.value) {
                    case "Jour":
                        var DateJour = new Date(this.SearchJourform.value['dateJour']);
                        PeriodeEtat = [
                            {
                                style: 'styleTab',
                                table: {
                                    widths: ['*', 'auto'],
                                    body: [
                                        [
                                            {
                                                text: 'ENREGISTREMENT EMPLOYES',
                                                border: [false, false, false, true],
                                                style: 'header'
                                            },
                                            {
                                                image: logo,
                                                width: 100,
                                                height: 30,
                                                border: [false, false, false, true],
    
                                            }
                                        ],
                                    ]
                                }
                            },
    
                            {
                                text:'LISTE DES EMPLOYES DU' + ' ' + moment(DateJour).format('DD/MM/YYYY'),
                                style: 'subheader1'
                            },
    
                            {
                                text: 'DATE D\'IMPRESSION : ' + moment(this.currentDate).format('DD/MM/YYYY hh:mm:ss'),
                                style: 'subheader2'
                            },
    
                            {
                                style: 'smarTab',
                                table: {
                                    widths: [70, '*', 150, '*'],
                                    body: [
                                        [
                                            {
                                                text: '',
                                                style: 'smarTabText',
                                                fillColor: '#eeeeee',
                                            },
                                            {
                                                text: 'TOTAL EMPLOYE',
                                                alignment: 'center',
                                                style: 'smarTabText',
                                            },
                                            {
                                                text: '',
                                                style: 'smarTabText',
                                                fillColor: '#eeeeee',
    
                                            },
                                            {
                                                text: this.employeExportation.length,
                                                alignment: 'center',
                                                style: 'smarTabText',
                                            },
                                        ],
                                    ]
                                },
    
                            },
    
                        ];
                        break;
        
                    case "Semaine":
                        var date_debut = new Date(this.SearchSemaineform.value['dateDebut']);
                        var date_fin = new Date(this.SearchSemaineform.value['dateFin']);
                        PeriodeEtat = [
                            {
                                style: 'styleTab',
                                table: {
                                    widths: ['*', 'auto'],
                                    body: [
                                        [
                                            {
                                                text: 'ENREGISTREMENT EMPLOYES',
                                                border: [false, false, false, true],
                                                style: 'header'
                                            },
                                            {
                                                image: logo,
                                                width: 100,
                                                height: 30,
                                                border: [false, false, false, true],
    
                                            }
                                        ],
                                    ]
                                }
                            },
    
                            {
                                text:'LISTE DES EMPLOYES DU' + ' ' + moment(date_debut).format('DD/MM/YYYY') + ' au ' + ' ' + moment(date_fin).format('DD/MM/YYYY'),
                                style: 'subheader1'
                            },
    
                            {
                                text: 'DATE D\'IMPRESSION : ' + moment(this.currentDate).format('DD/MM/YYYY hh:mm:ss'),
                                style: 'subheader2'
                            },
    
                            {
                                style: 'smarTab',
                                table: {
                                    widths: [70, '*', 150, '*'],
                                    body: [
                                        [
                                            {
                                                text: '',
                                                style: 'smarTabText',
                                                fillColor: '#eeeeee',
                                            },
                                            {
                                                text: 'TOTAL EMPLOYE',
                                                alignment: 'center',
                                                style: 'smarTabText',
                                            },
                                            {
                                                text: '',
                                                style: 'smarTabText',
                                                fillColor: '#eeeeee',
    
                                            },
                                            {
                                                text: this.employeExportation.length,
                                                alignment: 'center',
                                                style: 'smarTabText',
                                            },
                                        ],
                                    ]
                                },
    
                            },
    
                        ];
                        break;
        
                    case "Mois":
                        PeriodeEtat = [
                            {
                                style: 'styleTab',
                                table: {
                                    widths: ['*', 'auto'],
                                    body: [
                                        [
                                            {
                                                text: 'ENREGISTREMENT EMPLOYES',
                                                border: [false, false, false, true],
                                                style: 'header'
                                            },
                                            {
                                                image: logo,
                                                width: 100,
                                                height: 30,
                                                border: [false, false, false, true],
    
                                            }
                                        ],
                                    ]
                                }
                            },
    
                            {
                                text: 'LISTE DES EMPLOYES DU MOIS DE' + ' ' + this.moisCompletFrench(this.SearchMoisform.value['mois'] - 1 ) + ' ' + this.SearchMoisform.value['annee'],
                                style: 'subheader1'
                            },
    
                            {
                                text: 'DATE D\'IMPRESSION : ' + moment(this.currentDate).format('DD/MM/YYYY hh:mm:ss'),
                                style: 'subheader2'
                            },
    
                            {
                                style: 'smarTab',
                                table: {
                                    widths: [70, '*', 150, '*'],
                                    body: [
                                        [
                                            {
                                                text: '',
                                                style: 'smarTabText',
                                                fillColor: '#eeeeee',
                                            },
                                            {
                                                text: 'TOTAL EMPLOYE',
                                                alignment: 'center',
                                                style: 'smarTabText',
                                            },
                                            {
                                                text: '',
                                                style: 'smarTabText',
                                                fillColor: '#eeeeee',
    
                                            },
                                            {
                                                text: this.employeExportation.length,
                                                alignment: 'center',
                                                style: 'smarTabText',
                                            },
                                        ],
                                    ]
                                },
    
                            },
    
                        ];
                        break;
        
                    case "Annee":
                        PeriodeEtat = [
                            {
                                style: 'styleTab',
                                table: {
                                    widths: ['*', 'auto'],
                                    body: [
                                        [
                                            {
                                                text: 'ENREGISTREMENT EMPLOYES',
                                                border: [false, false, false, true],
                                                style: 'header'
                                            },
                                            {
                                                image: logo,
                                                width: 100,
                                                height: 30,
                                                border: [false, false, false, true],
    
                                            }
                                        ],
                                    ]
                                }
                            },
    
                            {
                                text:"LISTE DES EMPLOYES DE L'ANNEE" + ' ' + this.SearchAnneeform.value['annee'],
                                style: 'subheader1'
                            },
    
                            {
                                text: 'DATE D\'IMPRESSION : ' + moment(this.currentDate).format('DD/MM/YYYY hh:mm:ss'),
                                style: 'subheader2'
                            },
    
                            {
                                style: 'smarTab',
                                table: {
                                    widths: [70, '*', 150, '*'],
                                    body: [
                                        [
                                            {
                                                text: '',
                                                style: 'smarTabText',
                                                fillColor: '#eeeeee',
                                            },
                                            {
                                                text: 'TOTAL EMPLOYE',
                                                alignment: 'center',
                                                style: 'smarTabText',
                                            },
                                            {
                                                text: '',
                                                style: 'smarTabText',
                                                fillColor: '#eeeeee',
    
                                            },
                                            {
                                                text: this.employeExportation.length,
                                                alignment: 'center',
                                                style: 'smarTabText',
                                            },
                                        ],
                                    ]
                                },
    
                            },
    
                        ];
                        break;
        
                    default:
                        PeriodeEtat = null;
                        break;
                };


                //Tableau employé
                let rows: any[] = [
                    [
                        { text: 'Nom', style: 'tableHeader' },
                        { text: 'Prenoms', style: 'tableHeader' },
                        { text: 'Sexe', style: 'tableHeader' },
                        { text: 'Metier', style: 'tableHeader' },
                        { text: 'Specialité', style: 'tableHeader' },
                        { text: 'Entreprise', style: 'tableHeader' },
                        { text: 'Contact', style: 'tableHeader' },
                        { text: 'Date naissance', style: 'tableHeader' },
                        { text: 'Residence', style: 'tableHeader' },
                        { text: 'Date création', style: 'tableHeader' }
                    ],
                ];
                // La liste des employé retournée (employeExportation) est pacourue puis ajouter au tableau
                for (let i = 0; i < this.employeExportation.length; i++) {
                    const element = this.employeExportation[i];
        
                    let employe = [
                        { text: element?.nom },
                        { text: element?.prenom },
                        { text: element?.sexe == 1 ? "M":"F" },
                        { text: element?.metierEmploye.libelle },
                        { text: element?.specialiteMetier },
                        { text: element?.entreprise.nom },
                        { text: element?.contact1 },
                        { text: moment(element.dateNaissance).format('DD/MM/YYYY') },
                        { text: element?.residenceActuel },
                        { text: moment(element.dateCreation).format('DD/MM/YYYY') },
                    ];
        
                    rows.push(employe);
                }
                

                // Partie principale du pdfmake dans laquelle on appellé les variables : PeriodeEtat et rows
                // Crée avant (en dessus) 
                const documentDefinition: TDocumentDefinitions = {
                    content: [
                        PeriodeEtat,
                        {
                            style: 'employeTab',
                            table: {
                                body: rows,
                            },

                        },
                    ],
                    styles: {
                        header: {
                            fontSize: 16,
                            bold: true,
                        },
                        styleTab: {
                            lineHeight: 2,
                        },
                        subheader1: {
                            margin: [0, 19, 0, 10],
                            alignment: 'center',
                            bold: true
                        },
                        subheader2: {
                            margin: [0, 0, 0, 20],
                            alignment: 'center',
                            fontSize: 10,
                            bold: true
                        },
                        smarTab: {
                            margin: [0, 0, 0, 20],
                        },
                        smarTabText: {
                            fontSize: 10,
                        },
                        headerListEquipement: {
                            alignment: 'center',
                            decoration: 'underline',
                            lineHeight: 1.5
                        },
                        employeTab: {
                            fontSize: 8,
                        },
                        tableHeader: {
                            bold: true,
                            fontSize: 8,
                            fillColor: '#eeeeee',
                        }
                    }
                };

                pdfMake.createPdf(documentDefinition).open();
            }
        )

    }

    exportExcel(): void {
        const exportData = this.employeExportation.map((element) => {
            return {
                Nom: element?.nom,
                Prenoms: element?.prenom,
                Sexe: element?.sexe == 1 ? "M":"F",
                Metier: element?.metierEmploye.libelle,
                Specialite: element?.specialiteMetier,
                Entreprise: element?.entreprise.nom,
                Contact_1: element?.contact1,
                Contact_2: element?.contact2,
                DateNaissance: moment(element.dateNaissance).format('DD/MM/YYYY'),
                Residence: element?.residenceActuel,
                DateCreation: moment(element.dateCreation).format('DD/MM/YYYY'),
            };
        });
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }

    changeTab() {
        
        if (this.recensementControle.value === 'Jour') {
            this.searchFilterJournalier();
        }

        if (this.recensementControle.value === 'Semaine') {
            this.searchFilterHebdomadaire();
        }

        if (this.recensementControle.value === 'Mois') {
            this.searchFilterMensuel();
        }

        if (this.recensementControle.value === 'Annee') {
            this.searchFilterAnnuel();
        }
    }
}
