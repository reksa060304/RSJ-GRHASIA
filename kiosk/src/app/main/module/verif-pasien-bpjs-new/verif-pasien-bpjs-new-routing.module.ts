import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifPasienBpjsNewComponent } from './verif-pasien-bpjs-new.component';

const routes: Routes = [{ path: '', component: VerifPasienBpjsNewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifPasienBpjsNewRoutingModule { }
