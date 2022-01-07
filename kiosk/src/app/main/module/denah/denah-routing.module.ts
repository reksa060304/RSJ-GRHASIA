import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DenahComponent } from './denah.component';

const routes: Routes = [{ path: '', component: DenahComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DenahRoutingModule { }
