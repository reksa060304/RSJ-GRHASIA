import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PilihPoliRoutingModule } from './pilih-poli-routing.module';
import { PilihPoliComponent } from './pilih-poli.component';

import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    PilihPoliComponent
  ],
  imports: [
    CommonModule,
    PilihPoliRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule.forRoot(),
  ]
})
export class PilihPoliModule { }
