import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinV2Component } from './checkin-v2.component';

const routes: Routes = [
  {path:'', component:CheckinV2Component}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinV2RoutingModule { }
