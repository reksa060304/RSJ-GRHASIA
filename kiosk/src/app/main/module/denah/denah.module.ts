import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DenahRoutingModule } from './denah-routing.module';
import { DenahComponent } from './denah.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [DenahComponent],
  imports: [
    CommonModule,
    DenahRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule
  ]
})
export class DenahModule { }
