import { NgModule } from '@angular/core';
import { DomaineActiviteModule } from './domaine-activite/domaine-activite.module';
import { StatutJuridiqueModule } from './statut-juridique/statut-juridique.module';
import { MetierEmployeModule } from './metier-employe/metier-employe.module';
import { TypePieceModule } from './type-piece/type-piece.module';
import { StatutMatrimonialModule } from './statut-matrimonial/statut-matrimonial.module';




@NgModule({
  declarations: [],
  imports: [
    DomaineActiviteModule,
    StatutJuridiqueModule,
    MetierEmployeModule,
    TypePieceModule,
    StatutMatrimonialModule
  ]
})
export class ParametrageModule {}
