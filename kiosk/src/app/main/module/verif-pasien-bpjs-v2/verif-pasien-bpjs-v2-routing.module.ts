import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifPasienBpjsV2Component } from './verif-pasien-bpjs-v2.component';

const routes: Routes = [{ path: '', component: VerifPasienBpjsV2Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifPasienBpjsV2RoutingModule { }
