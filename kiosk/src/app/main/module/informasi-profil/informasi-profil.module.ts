import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformasiProfilRoutingModule } from './informasi-profil-routing.module';
import { InformasiProfilComponent } from './informasi-profil.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

import { HttpService } from '../httpService';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    InformasiProfilComponent
  ],
  imports: [
    CommonModule,
    InformasiProfilRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule
  ],
  providers: [HttpService]
})
export class InformasiProfilModule { }
