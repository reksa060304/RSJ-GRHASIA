import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CekKepesertaanBpjsRoutingModule } from './cek-kepesertaan-bpjs-routing.module';
import { CekKepesertaanBpjsComponent } from './cek-kepesertaan-bpjs.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ToastrModule } from 'ngx-toastr';
import { AlertService } from '../alert.service';

@NgModule({
  declarations: [CekKepesertaanBpjsComponent],
  imports: [
    CommonModule,
    CekKepesertaanBpjsRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule.forRoot()
  ],
  providers:[
    AlertService
  ]
})
export class CekKepesertaanBpjsModule { }
