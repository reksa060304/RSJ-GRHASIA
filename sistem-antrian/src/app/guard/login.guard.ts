import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MessageService } from 'primeng/api';
// import { TranslatorService } from '../service/translator.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
	constructor(private router: Router, private messageService: MessageService
		// , private translate: TranslatorService
		) { }
	konfirmLogout:  string;
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (localStorage.getItem('storageKiosk')) {
			this.messageService.clear();
	    	this.messageService.add({key: 't-logout', sticky: true, severity:'warn', summary:'Yakin mau Logout ', detail:''});
	    	return false
		} else if (sessionStorage.getItem('storageKiosk')){
			this.messageService.clear();
	    	this.messageService.add({key: 't-logout', sticky: true, severity:'warn', summary:'Yakin mau Logout ', detail:''});
	    	return false
		}
		return true;
	}
}
