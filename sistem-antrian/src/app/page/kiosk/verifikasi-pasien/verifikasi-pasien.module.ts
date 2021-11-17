import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifikasiPasienRoutingModule } from './verifikasi-pasien-routing.module';
import { VerifikasiPasienComponent } from './verifikasi-pasien.component';
import { primeNgModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    VerifikasiPasienComponent
  ],
  imports: [
    CommonModule,
    VerifikasiPasienRoutingModule,
    primeNgModule
  ]
})
export class VerifikasiPasienModule { }
