import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservasiRoutingModule } from './reservasi-routing.module';
import { ReservasiComponent } from './reservasi.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

@NgModule({
  declarations: [
    ReservasiComponent
  ],
  imports: [
    CommonModule,
    ReservasiRoutingModule,
    CoreCommonModule,
    FormsModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
   
    ToastrModule,
    Ng2FlatpickrModule
  ]
})
export class ReservasiModule { }
