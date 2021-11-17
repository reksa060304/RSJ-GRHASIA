import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelfRegisRoutingModule } from './self-regis-routing.module';
import { SelfRegisComponent } from './self-regis.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

@NgModule({
  declarations: [
    SelfRegisComponent
  ],
  imports: [
    CommonModule,
    SelfRegisRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
  ]
})
export class SelfRegisModule { }
