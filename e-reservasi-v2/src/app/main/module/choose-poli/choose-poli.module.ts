import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChoosePoliRoutingModule } from './choose-poli-routing.module';
import { ChoosePoliComponent } from './choose-poli.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

import { HttpService } from '../httpService';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ToastrsModule } from 'app/main/extensions/toastr/toastr.module';


@NgModule({
  declarations: [
    ChoosePoliComponent
  ],
  imports: [
    CommonModule,
    ChoosePoliRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule.forRoot(),
  ],
  providers: [HttpService]
})
export class ChoosePoliModule { }
