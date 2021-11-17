import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TouchscreenRoutingModule } from './touchscreen-routing.module';
import { TouchscreenComponent } from './touchscreen.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { knowledgeBaseQuestionService } from 'app/main/pages/kb/knowledge-base-question/knowledge-base-question.service';
import { knowledgeBaseCategoryService } from 'app/main/pages/kb/knowledge-base-category/knowledge-base-category.service';
import { knowledgeBaseService } from 'app/main/pages/kb/knowledge-base/knowledge-base.service';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    TouchscreenComponent
  ],
  imports: [
    CommonModule,
    TouchscreenRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    CardSnippetModule,
    ToastrModule
  ],
  providers: [knowledgeBaseService, knowledgeBaseCategoryService, knowledgeBaseQuestionService]
})
export class TouchscreenModule { }
