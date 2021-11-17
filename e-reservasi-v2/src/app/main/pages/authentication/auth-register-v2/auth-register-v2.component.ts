import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { HttpService } from 'app/main/module/httpService';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import moment from 'moment';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth-register-v2',
  templateUrl: './auth-register-v2.component.html',
  styleUrls: ['./auth-register-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthRegisterV2Component implements OnInit {
  // Public
  public userNameVar;
  public emailVar;
  public nikVar;
  public tglLahirVar;
  public passwordVar;
  public coreConfig: any;
  public passwordTextType: boolean;
  public error = '';
  // Private
  private _unsubscribeAll: Subject<any>;
  public loading = false;
  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(

    private _authenticationService: AuthenticationService,
    private _coreConfigService: CoreConfigService,
    private _router: Router,
    public formatter: NgbDateParserFormatter,
    private httpService: HttpService,
    private _toastrService: ToastrService) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onSubmit(bool) {
    if (bool) {
      this.loading = true;
      let json = {
        'nik': this.nikVar,
        'email': this.emailVar,
        'password': this.passwordVar,
        'namalengkap': this.userNameVar,
        'tgllahir':this.formatter.format(this.tglLahirVar)
      }
      // Login
      this.loading = true;
      this._authenticationService
        .signup(json)
        .pipe(first())
        .subscribe(
          // this.httpService.post('medifirst2000/auth/sign-up-pasien',
          //   json).subscribe(
          resps => {
            setTimeout(() => {
              this._toastrService.success(
                '',
                'Register Sukses!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            this.loading = false
            this._router.navigate(['/pages/authentication/login-v2']);
          },
          err => {
            this.loading = false
            this.error = err
          }
        )
    }
  }
}
