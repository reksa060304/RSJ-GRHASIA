import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformasiPelayananComponent } from './informasi-pelayanan.component';

const routes: Routes = [{ path: '', component: InformasiPelayananComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformasiPelayananRoutingModule { }
