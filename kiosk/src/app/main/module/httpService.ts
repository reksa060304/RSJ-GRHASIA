import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';
import { Configuration } from './config';
import { of } from 'rxjs';
import { LoaderService } from '../components/loader/loader.service';
@Injectable({ providedIn: 'root' })
export class HttpService {
  //public
  public currentUser: Observable<User>;
  serviceData: any;
  method: any;
  url: string;
  data: any;
  errorMessage: any;
  callBack: (res: any) => any;

  superUserToken: string;
  isSuperUserReq: boolean = false;

  listSucces = [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210]
  token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraW9zayJ9.tAHVUlYInFR5a7kUQliRwAov6QnCqI7pZgQz7Tm5vczDRByPcX5jZ55J1mM0RLWi98rRmxIJQuspxjwv1GT9bA"
  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService,
    private loader: LoaderService) {

  }




  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/users/authenticate`, { email, password })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in as an ' +
                user.role +
                ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                '👋 Welcome, ' + user.firstName + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            // notify

          }

          return user;
        })
      );
  }
  createAuthorizationHeader(headers: Headers, customToken: string = null) {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    headers.set('X-URL', window.location.hash);
    headers.set('X-AUTH-TOKEN', this.token);
    headers.set('X-USER-CREATE', 'Ramdanegie');

  }
  get(url, callBack: (res: any) => any = null, auth: boolean = false, tokenSuper: string = null) {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('X-AUTH-TOKEN', this.token);
    this.showLoader();

    return this._http.get(Configuration.get().apiBackend + url
      , { headers: headers, withCredentials: false }
    )
      .pipe(map((res: any) => {

        if (callBack !== undefined && callBack !== null) {
          callBack(res);
        }
        return res;
      })
        , catchError(error => {
          this.handleError(error);
          return of([]);
        })
        , finalize(() => {
          this.hideLoader();
        })
      )
  }
  post(url, data, callBack: (res: any) => any = null, auth: boolean = false, tokenSuper: string = null) {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('X-AUTH-TOKEN', this.token);
    this.showLoader();


    return this._http.post(Configuration.get().apiBackend + url, data
      , { headers: headers, withCredentials: false }
    )
      .pipe(map((res: any) => {
        this.responseSuccess(res)
        if (callBack !== undefined && callBack !== null) {
          callBack(res);
        }
        return res;
      })
        , catchError(error => {
          this.handleError(error);
          return of([]);
        })
        , finalize(() => {
          this.hideLoader();
        })
      )
  }
  postNonMessage(url, data, callBack: (res: any) => any = null, auth: boolean = false, tokenSuper: string = null) {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set('X-AUTH-TOKEN', this.token);
    this.showLoader();


    return this._http.post(Configuration.get().apiBackend + url, data
      , { headers: headers, withCredentials: false }
    )
      .pipe(map((res: any) => {
        // this.responseSuccess(res)
        if (callBack !== undefined && callBack !== null) {
          callBack(res);
        }
        return res;
      })
        , catchError(error => {
          // this.handleError(error);
          return of([]);
        })
        , finalize(() => {
          this.hideLoader();
        })
      )
  }
  private responseSuccess(res: Response | any) {

    if (this.listSucces.includes(res.status)) {
      let message = res.message
      if (message) {
        this._toastrService.success('', message, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });

      } else {
        this._toastrService.success('', 'Data berhasil disimpan', {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });

      }
    }
  }
  private handleError(error: Response | any) {
    // console.log(error);
    if (error.status == 0) {
      this._toastrService.warning('', 'Maaf, koneksi ke server terputus, silahkan coba lagi.', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      // this.alert.warn('Peringatan', 'Maaf, koneksi ke server terputus, silahkan coba lagi.');

    } else if (error.status == 500) {

      if (error._body == '') {
        this.errorMessage = {};
        let errorText = 'Error tidak diketahui';
        this._toastrService.warning('', errorText, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });


      } else {
        this.errorMessage = JSON.parse(error._body)
        // let errorText = '';
        // for (let i = 0; i < this.errorMessage.errors.length; i++) {
        //   errorText += this.errorMessage.errors[i].error;
        // }
        this._toastrService.warning('', this.errorMessage.message, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });

      }

    } else if (error.status == 401) {
      if (error.headers.get('RequireSupervisor') == 'true') {

      } else {
        this._toastrService.warning('', 'Tidak punya hak akses, silahkan coba login ulang atau hubungi administrator', {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
      }
    } else if (error.status == 403) {
      this._toastrService.error('', 'Maaf, sesi sudah berakhir, silahkan login ulang.', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });

    } else if (error.status == 404) {
      this._toastrService.error('', 'Maaf, halaman API tidak ditemukan.', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });

    } else if (error.status == 503 || error.status == 504) {
      this._toastrService.warning('', 'Maaf, server time out, tidak dapat melayani permintaan. Silahkan Ulangi.', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });

    } else if (error.status == 400 || error.status == 400) {
      if (JSON.parse(error._body).batal !== undefined) {
        this._toastrService.warning('', JSON.parse(error._body).message, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });

      } else {
        this._toastrService.error('', JSON.parse(error._body).message, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });

      }
    } else {
      this._toastrService.error('', error, {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
    }

  }
  showLoader(): void {
    this.loader.show();
  }

  hideLoader(): void {
    this.loader.hide();
  }
  private reject() {
    return Promise.reject('koneksi terputus');
  }

  //   
}
