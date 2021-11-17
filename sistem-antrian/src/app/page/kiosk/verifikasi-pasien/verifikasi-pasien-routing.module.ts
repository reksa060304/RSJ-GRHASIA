import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifikasiPasienComponent } from './verifikasi-pasien.component';

const routes: Routes = [{path:'',component:VerifikasiPasienComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifikasiPasienRoutingModule { }
