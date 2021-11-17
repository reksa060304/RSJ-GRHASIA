import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckinRoutingModule } from './checkin-routing.module';
import { CheckinComponent } from './checkin.component';
import { primeNgModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CheckinComponent
  ],
  imports: [
    CommonModule,
    CheckinRoutingModule,
    primeNgModule
  ]
})
export class CheckinModule { }
