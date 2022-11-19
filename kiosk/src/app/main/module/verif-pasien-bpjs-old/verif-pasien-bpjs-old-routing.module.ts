import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifPasienBpjsOldComponent } from './verif-pasien-bpjs-old.component';

const routes: Routes = [{ path: '', component: VerifPasienBpjsOldComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifPasienBpjsOldRoutingModule { }
