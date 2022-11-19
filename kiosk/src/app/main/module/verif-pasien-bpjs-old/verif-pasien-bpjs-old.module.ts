import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifPasienBpjsOldRoutingModule } from './verif-pasien-bpjs-old-routing.module';
import { VerifPasienBpjsOldComponent } from './verif-pasien-bpjs-old.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ToastrModule } from 'ngx-toastr';
import { AlertService } from '../alert.service';


@NgModule({
  declarations: [VerifPasienBpjsOldComponent],
  imports: [
    CommonModule,
    VerifPasienBpjsOldRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule.forRoot(),
  ],
  providers:[
    AlertService
  ]
})
export class VerifPasienBpjsOldModule { }
