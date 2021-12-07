import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformasiKamarRoutingModule } from './informasi-kamar-routing.module';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ToastrModule } from 'ngx-toastr';
import { InformasiKamarComponent } from './informasi-kamar.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
    InformasiKamarComponent
  ],
  imports: [
    CommonModule,
    InformasiKamarRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule,
    
    NgxDatatableModule,
  ]
})
export class InformasiKamarModule { }
