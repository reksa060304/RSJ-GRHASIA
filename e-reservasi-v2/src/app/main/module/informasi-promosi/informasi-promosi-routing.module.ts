import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformasiPromosiComponent } from './informasi-promosi.component';

const routes: Routes = [{ path: '', component: InformasiPromosiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformasiPromosiRoutingModule { }
