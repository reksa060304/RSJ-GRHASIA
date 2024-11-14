import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'app/auth/service';

@Injectable({ providedIn: 'root' })
export class RedirectGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  
  constructor(private _router: Router, private _authenticationService: AuthenticationService) {}

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._authenticationService.currentUserValue;
    // if(window.location.host.indexOf('103.131.104.56') > -1){
    //     this._router.navigate(['/pages/miscellaneous/error']);
    //     return false;
    // }
    // if(window.location.host.indexOf('simrs-grhasia.jogjaprov.go.id') > -1){
    //   this._router.navigate(['/pages/miscellaneous/error']);
    //   return false;
    // }
    return true;

    // not logged in so redirect to login page with the return url
    // this._router.navigate(['/pages/authentication/login-v2'], { queryParams: { returnUrl: state.url } });
    // return false;
  }
}
