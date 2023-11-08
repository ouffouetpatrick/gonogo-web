import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { Employe } from 'app/interfaces/employe/employe';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { EmployeService } from 'app/services/employe/employe.service';
import { environment } from 'environments/environment';

@Component({
    selector     : 'detail-employe',
    templateUrl  : './detail-employe.component.html',
    styleUrls: ['./detail-employe.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DetailEmployeComponent implements OnInit
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
    employe: Employe;
    imageUrl = environment.api + '/files/';


    constructor(
        private _employeService : EmployeService,
        private _activatedRoute: ActivatedRoute, //Capturer un element de l'url dans la route active
    ){}

    ngOnInit(): void {
        this.getIdInActiveRoute();
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
        // La recherche s'effectue dans la listeEmployes 
        // (les données ont eté stockées dans listeEmployes au niveau de enregistrement.component.ts (getListeEmploye))
        this.employe = this._employeService.listeEmployes.find(element => element.id == employeId)
        
    }

}
