import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifPasienBpjsComponent } from './verif-pasien-bpjs.component';

const routes: Routes = [{ path: '', component: VerifPasienBpjsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifPasienBpjsRoutingModule { }
