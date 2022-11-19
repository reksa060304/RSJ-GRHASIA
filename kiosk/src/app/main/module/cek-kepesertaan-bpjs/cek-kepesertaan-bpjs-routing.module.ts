import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CekKepesertaanBpjsComponent } from './cek-kepesertaan-bpjs.component';

const routes: Routes = [{ path: '', component: CekKepesertaanBpjsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CekKepesertaanBpjsRoutingModule { }
