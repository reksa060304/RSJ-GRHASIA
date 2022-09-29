import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewerPoliComponent } from './viewer-poli.component';

const routes: Routes = [{ path: '', component: ViewerPoliComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewerPoliRoutingModule { }
