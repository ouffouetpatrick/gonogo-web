import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { Pagination } from 'app/interfaces/utils/Pagination';

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    styleUrls: ['./example.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent
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
    
    constructor()
    {}
}
