import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckinV2RoutingModule } from './checkin-v2-routing.module';
import { CheckinV2Component } from './checkin-v2.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    CheckinV2Component
  ],
  imports: [
    CommonModule,
    CheckinV2RoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule.forRoot(),
  ]
})
export class CheckinV2Module { }
