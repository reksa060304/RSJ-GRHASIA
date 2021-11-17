import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckinRoutingModule } from './checkin-routing.module';
import { CheckinComponent } from './checkin.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    CheckinComponent
  ],
  imports: [
    CommonModule,
    CheckinRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule.forRoot(),
  ]
})
export class CheckinModule { }
