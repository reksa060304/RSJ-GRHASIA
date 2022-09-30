import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerPoliRoutingModule } from './viewer-poli-routing.module';
import { primeNgModule } from 'src/app/shared/shared.module';
import { ViewerPoliComponent } from './viewer-poli.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { DPlayerModule } from 'angular-dplayer';


@NgModule({
  declarations: [ViewerPoliComponent],
  imports: [
    CommonModule,
    ViewerPoliRoutingModule,
    primeNgModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    DPlayerModule
  ]
})
export class ViewerPoliModule { }
