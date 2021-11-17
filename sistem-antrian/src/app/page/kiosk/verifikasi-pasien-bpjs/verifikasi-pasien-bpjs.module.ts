import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifikasiPasienBpjsRoutingModule } from './verifikasi-pasien-bpjs-routing.module';

import { primeNgModule } from 'src/app/shared/shared.module';
import { VerifikasiPasienBpjsComponent } from './verifikasi-pasien-bpjs.component';

@NgModule({
  declarations: [
    VerifikasiPasienBpjsComponent
  ],
  imports: [
    CommonModule,
    VerifikasiPasienBpjsRoutingModule,
    primeNgModule,
  ]
})
export class VerifikasiPasienBpjsModule { }
