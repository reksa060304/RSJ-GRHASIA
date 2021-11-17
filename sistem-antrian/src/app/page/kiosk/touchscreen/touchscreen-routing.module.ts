import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TouchscreenComponent } from './touchscreen.component';

const routes: Routes = [
  { path: '', component: TouchscreenComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TouchscreenRoutingModule { }
