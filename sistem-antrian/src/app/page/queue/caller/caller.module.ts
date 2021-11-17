import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallerRoutingModule } from './caller-routing.module';
import { primeNgModule } from 'src/app/shared/shared.module';
import { CallerComponent } from './caller.component';


@NgModule({
  declarations: [
    CallerComponent
  ],
  imports: [
    CommonModule,
    CallerRoutingModule,
    primeNgModule
  ]
})
export class CallerModule { }
