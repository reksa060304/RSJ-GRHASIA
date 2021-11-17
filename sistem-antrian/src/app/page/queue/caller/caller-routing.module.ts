import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallerComponent } from './caller.component';

const routes: Routes = [
  { path: '', component: CallerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallerRoutingModule { }
