import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformasiKamarComponent } from './informasi-kamar.component';

const routes: Routes = [{ path:'',component:InformasiKamarComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformasiKamarRoutingModule { }
