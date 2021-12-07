import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifPasienComponent } from './verif-pasien.component';
const routes: Routes = [{ path: '', component: VerifPasienComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifPasienRoutingModule { }
