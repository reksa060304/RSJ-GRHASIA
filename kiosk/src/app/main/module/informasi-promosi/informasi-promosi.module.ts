import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformasiPromosiRoutingModule } from './informasi-promosi-routing.module';
import { InformasiPromosiComponent } from './informasi-promosi.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { CoreCommonModule } from '@core/common.module';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [InformasiPromosiComponent],
  imports: [
    CommonModule,
    InformasiPromosiRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule
    
  ]
})
export class InformasiPromosiModule { }
