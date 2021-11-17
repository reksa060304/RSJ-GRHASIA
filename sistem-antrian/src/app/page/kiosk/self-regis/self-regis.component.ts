
import { AfterViewInit, Component, forwardRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { Config } from '../../../guard';
import { ApiService, AuthService } from '../../../service';
import * as moment from 'moment';
import { CacheService } from 'src/app/service/cache.service';
import { HelperService } from 'src/app/service/helperService';
import { AlertService } from 'src/app/service/component/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-self-regis',
  templateUrl: './self-regis.component.html',
  styleUrls: ['./self-regis.component.scss']
})
export class SelfRegisComponent implements OnInit {

  constructor(@Inject(forwardRef(() => AppComponent))
    private apiService: ApiService,
    private authService: AuthService,
    private cacheHelper: CacheService,
    private dateHelper: HelperService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private http:HttpClient) { }

  ngOnInit(): void {
  }
  changePage(url) {
    if (url == 'false') {
      this.alertService.info('Informasi','Mohon Lakukan Registrasi melalui Loket Pendaftaran !')
      return
    }
    if (url == 'BPJS')
      this.router.navigate(['touchscreen/self-regis/verif-pasien-bpjs'], { queryParams: { page: url } })
    else
      this.router.navigate(['touchscreen/self-regis/verif-pasien'], { queryParams: { page: url } })
  }
  goBack() {
    window.history.back()
  }
  print(jenis) {
    let antrian = {
      "jenis": jenis
    }
    this.apiService.post('kiosk/save-antrian', antrian).subscribe(response => {
      this.http.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => {
        // do something with response
      })

    }, error => {

    })
    window.history.back()
  }
}
