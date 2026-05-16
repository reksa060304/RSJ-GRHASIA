import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../httpService';
import { Configuration } from '../config';

@Component({
  selector: 'app-self-regis',
  templateUrl: './self-regis.component.html',
  styleUrls: ['./self-regis.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelfRegisComponent implements OnInit {
  contentHeader:any
  constructor(   private router: Router,
    private httpService: HttpService,
    private http: HttpClient,
    private alertService:ToastrService) { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Self Registration',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Menu Utama',
            isLink: true,
            link: '/touchscreen'
          },

        ]
      }
    };
  }
  changePage(url) {
    if (url == 'false') {
      this.alertService.info('', 'Mohon Lakukan Registrasi melalui Loket Pendaftaran !', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      // this.alertService.info('Informasi','Mohon Lakukan Registrasi melalui Loket Pendaftaran !')
      return
    }
    if (url == 'BPJS')
      this.router.navigate(['touchscreen/self-regis/verif-pasien-bpjs'], { queryParams: { page: url } })
    else
      this.router.navigate(['touchscreen/self-regis/verif-pasien'], { queryParams: { page: url } })
  }

  print(jenis) {
    let antrian = {
      "jenis": jenis
    }
    this.httpService.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
      
      const url = Configuration.get().apiBackend +
        'medifirst2000/report/cetak-antrian?norec=' +
        response.noRec +
        '&kdprofile=30';

      window.open(url, '_blank');

      setTimeout(() => {
        this.router.navigate(['/touchscreen/checkin-v2']);
      }, 2000);

    }, error => {
      console.error('Save antrian gagal', error);
    });

  }
}
