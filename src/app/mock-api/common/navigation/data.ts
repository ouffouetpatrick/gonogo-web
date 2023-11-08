import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    
    {
        id   : 'employe',
        title: 'Employe',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-list',
        link : '/enregistrement'
    },
    {
        id   : 'entreprise',
        title: 'Entreprise',
        type : 'basic',
        icon : 'heroicons_outline:office-building',
        link : '/entreprise'
    },
    {
        id   : 'gestion-etat',
        title: 'Gestion etat',
        type : 'basic',
        icon : 'mat_solid:manage_search',
        link : '/gestion-etat'
    },
    {
        id      : 'administration',
        title   : 'Administration',
        type    : 'collapsable',
        icon    : 'mat_solid:admin_panel_settings',
        children: [
            {
                id   : 'utilisateur',
                title: 'Utilisateur',
                type : 'basic',
                link :'administration/utilisateur'
            },
            {
                id   : 'profil',
                title: 'Profil',
                type : 'basic',
                link : '/administration/profil'
            },
            {
                id   : 'droit',
                title: 'Droit',
                type : 'basic',
                link : '/administration/droit'
            },
            {
                id   : 'module',
                title: 'Module',
                type : 'basic',
                link : '/administration/module'
            }
        ]
    },
    {
        id      : 'parametrage',
        title   : 'Parametrage',
        type    : 'collapsable',
        icon    : 'feather:settings',
        children: [
            {
                id   : 'domaineActivite',
                title: 'DomaineActivite',
                type : 'basic',
                link : 'parametrage/domaineActivite'
            },
            {
                id   : 'statutJuridique',
                title: 'StatutJuridique',
                type : 'basic',
                link : 'parametrage/statutJuridique'
            },
            {
                id   : 'metierEmploye',
                title: 'MetierEmploye',
                type : 'basic',
                link : 'parametrage/metierEmploye'
            },
            {
                id   : 'typePiece',
                title: 'TypePiece',
                type : 'basic',
                link : 'parametrage/typePiece'
            },
            {
                id   : 'statutMatrimonial',
                title: 'StatutMatrimonial',
                type : 'basic',
                link : 'parametrage/statutMatrimonial'
            },
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [];
export const futuristicNavigation: FuseNavigationItem[] = [];
export const horizontalNavigation: FuseNavigationItem[] = [];
