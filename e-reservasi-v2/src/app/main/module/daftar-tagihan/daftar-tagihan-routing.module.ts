import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaftarTagihanComponent } from './daftar-tagihan.component';

const routes: Routes = [{
  path: '', component: DaftarTagihanComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DaftarTagihanRoutingModule { }
