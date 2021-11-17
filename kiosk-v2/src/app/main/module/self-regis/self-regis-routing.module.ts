import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelfRegisComponent } from './self-regis.component';

const routes: Routes = [{ path: '', component: SelfRegisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfRegisRoutingModule { }
