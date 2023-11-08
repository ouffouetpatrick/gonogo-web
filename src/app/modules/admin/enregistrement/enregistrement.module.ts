import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EnregistrementComponent } from './enregistrement.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { MatStepperModule } from '@angular/material/stepper';
import { EnreEmployeFormComponent } from './enreEmployeForm/enreEmployeForm.component';
import { DetailEmployeComponent } from './detail-employe/detail-employe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialFileInputModule } from 'ngx-material-file-input';

const enregistrementRoutes: Route[] = [
    {
        path     : '',
        component: EnregistrementComponent
    },
    {
        path     : 'enreEmployeForm',
        component: EnreEmployeFormComponent
    },
    {
        path     : 'enreEmployeForm/:id',
        component: EnreEmployeFormComponent
    },
    {
        path     : 'detailEmploye/:id',
        component: DetailEmployeComponent
    },
];

@NgModule({
    declarations: [
        EnregistrementComponent,
        EnreEmployeFormComponent,
        DetailEmployeComponent,
    ],
    imports     : [
        RouterModule.forChild(enregistrementRoutes),
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
        MatMomentDateModule,
        MatBadgeModule,

        //Formulaire par etape
        MatStepperModule,
        ReactiveFormsModule,

        MaterialFileInputModule,

    ]
})
export class EnregistrementModule{}
