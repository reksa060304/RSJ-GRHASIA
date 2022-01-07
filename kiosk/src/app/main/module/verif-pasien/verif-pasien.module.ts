import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifPasienRoutingModule } from './verif-pasien-routing.module';
import { VerifPasienComponent } from './verif-pasien.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    VerifPasienComponent
  ],
  imports: [
    CommonModule,
    VerifPasienRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule.forRoot(),
  ]
})
export class VerifPasienModule { }
