import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformasiProfilComponent } from './informasi-profil.component';

const routes: Routes = [{ path: '', component: InformasiProfilComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformasiProfilRoutingModule { }
