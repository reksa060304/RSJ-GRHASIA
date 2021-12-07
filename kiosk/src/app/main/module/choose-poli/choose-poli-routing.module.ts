import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoosePoliComponent } from './choose-poli.component';

const routes: Routes = [{ path: '', component: ChoosePoliComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChoosePoliRoutingModule { }
