import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AlertService {
    maps = [];
    constructor(
        private alertService: ToastrService,
    ) { }

    warn(title, msg) {
        this.alertService.warning('', title + ', ' + msg, {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
        });
    }
    error(title, msg) {
        this.alertService.error('', title + ', ' + msg, {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
        });
    }
    success(title, msg) {
        this.alertService.success('', title + ', ' + msg, {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
        });
    }
    info(title, msg) {
        this.alertService.info('', title + ', ' + msg, {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
        });
    }
}
