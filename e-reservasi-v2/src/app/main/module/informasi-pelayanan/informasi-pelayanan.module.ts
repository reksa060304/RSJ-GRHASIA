import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformasiPelayananRoutingModule } from './informasi-pelayanan-routing.module';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

import { HttpService } from '../httpService';
import { ToastrModule } from 'ngx-toastr';
import { InformasiPelayananComponent } from './informasi-pelayanan.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
    InformasiPelayananComponent
  ],
  imports: [
    CommonModule,
    InformasiPelayananRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule,
    NgxDatatableModule,
  ],
  providers: []
})
export class InformasiPelayananModule { }
