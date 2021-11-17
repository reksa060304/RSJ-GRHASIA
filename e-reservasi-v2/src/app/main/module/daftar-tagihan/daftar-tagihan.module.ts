import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DaftarTagihanRoutingModule } from './daftar-tagihan-routing.module';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DaftarTagihanComponent } from './daftar-tagihan.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

@NgModule({
  declarations: [DaftarTagihanComponent],
  imports: [
    CommonModule,
    DaftarTagihanRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ToastrModule.forRoot(),
    NgxDatatableModule,
    Ng2FlatpickrModule
  ]
})
export class DaftarTagihanModule { }
