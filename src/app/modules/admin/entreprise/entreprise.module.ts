import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { EntrepriseComponent } from './entreprise.component';
import { EntrepriseFormComponent } from './entrepriseForm/entrepriseForm.component';

const entrepriseRoutes: Route[] = [
    {
        path     : '',
        component: EntrepriseComponent
    }
];

@NgModule({
    declarations: [
        EntrepriseComponent,
        EntrepriseFormComponent,
    ],
    imports     : [
        RouterModule.forChild(entrepriseRoutes),
        MatIconModule,
        MatTabsModule,
        MatTableModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatMenuModule,
        MatRadioModule,
        MatSelectModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatInputModule,
        MatGridListModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatDialogModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatSnackBarModule,
        QuillModule.forRoot(),
        SharedModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatBadgeModule
    ]
})
export class EntrepriseModule{}
