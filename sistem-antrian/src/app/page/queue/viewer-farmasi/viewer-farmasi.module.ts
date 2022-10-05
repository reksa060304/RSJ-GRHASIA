import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerFarmasiRoutingModule } from './viewer-farmasi-routing.module';
import { primeNgModule } from 'src/app/shared/shared.module';
import { ViewerFarmasiComponent } from './viewer-farmasi.component';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [ViewerFarmasiComponent],
  imports: [
    CommonModule,
    ViewerFarmasiRoutingModule,
    primeNgModule,
    TableModule
  ]
})
export class ViewerFarmasiModule { }
