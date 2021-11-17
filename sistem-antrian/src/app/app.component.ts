import { Component, HostListener, HostBinding } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent, RouterOutlet } from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { routerAnimation } from './app.animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerAnimation()],
})
export class AppComponent {

  // layoutMode = 'static';

  // theme = 'green';
  layoutMode = 'overlay';
  theme = 'indigo';
  inputStyle = 'outlined';
  ripple: boolean;
  constructor(private primengConfig: PrimeNGConfig,
  ) {

  }
  ngOnInit() {
    this.primengConfig.ripple = true;
    this.ripple = true;
  }
 
  public getRouteAnimation(outlet: RouterOutlet) {
    const res =
      outlet.activatedRouteData.num === undefined
        ? -1
        : outlet.activatedRouteData.num;

    return res;
  }
}
