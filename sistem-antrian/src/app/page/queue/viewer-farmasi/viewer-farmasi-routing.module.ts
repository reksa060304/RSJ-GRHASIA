import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewerFarmasiComponent } from './viewer-farmasi.component';

const routes: Routes = [{path:'',component:ViewerFarmasiComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewerFarmasiRoutingModule { }
