import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PilihPoliRoutingModule } from './pilih-poli-routing.module';
import { PilihPoliComponent } from './pilih-poli.component';
import { primeNgModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PilihPoliComponent
  ],
  imports: [
    CommonModule,
    PilihPoliRoutingModule,
    primeNgModule
  ]
})
export class PilihPoliModule { }
