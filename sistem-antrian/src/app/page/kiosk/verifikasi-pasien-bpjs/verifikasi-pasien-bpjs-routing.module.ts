import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifikasiPasienBpjsComponent } from './verifikasi-pasien-bpjs.component';

const routes: Routes = [{
  path:'',component:VerifikasiPasienBpjsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifikasiPasienBpjsRoutingModule { }
