import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelfRegisRoutingModule } from './self-regis-routing.module';
import { SelfRegisComponent } from './self-regis.component';
import { primeNgModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SelfRegisComponent
  ],
  imports: [
    CommonModule,
    SelfRegisRoutingModule,
    primeNgModule
  ]
})
export class SelfRegisModule { }
