import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinFarmComponent } from './checkin-farm.component';

const routes: Routes = [
  {path:'', component:CheckinFarmComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinFarmRoutingModule { }
