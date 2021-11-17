import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TouchscreenRoutingModule } from './touchscreen-routing.module';
import { TouchscreenComponent } from './touchscreen.component';
import { primeNgModule } from 'src/app/shared/shared.module';
import { materialModule } from 'src/app/shared/material.module';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';

@NgModule({
  declarations: [
    TouchscreenComponent
  ],
  imports: [
    CommonModule,
    TouchscreenRoutingModule,
    primeNgModule,
    materialModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ]
})
export class TouchscreenModule { }
