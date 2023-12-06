import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let userRole = JSON.parse(localStorage.getItem('storageKiosk.role'))
        if (window.location.host.indexOf('103.131.104.56') > -1){
            this.router.navigate(['/access-denied']);
            return false;
        }
        if (window.location.host.indexOf('simrs-grhasia.jogjaprov.go.id') > -1){
            this.router.navigate(['/access-denied']);
            return false;
        }
        if (localStorage.getItem('storageKiosk')) {
            // if (userRole && userRole.indexOf(state.url) === -1){
            //     this.router.navigate(['/access-denied']);
            //     return false;
            // }
            return true;
        } else if (sessionStorage.getItem('storageKiosk')){
            // if (userRole && userRole.indexOf(state.url) === -1){
            //     this.router.navigate(['/access-denied']);
            //     return false;
            // }
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}
