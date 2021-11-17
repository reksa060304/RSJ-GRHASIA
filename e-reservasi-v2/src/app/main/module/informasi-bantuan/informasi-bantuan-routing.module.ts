import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformasiBantuanComponent } from './informasi-bantuan.component';

const routes: Routes = [
  { path: '', component: InformasiBantuanComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformasiBantuanRoutingModule { }
