
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { Configuration } from '../config';

import { HttpService } from '../httpService';

@Component({
  selector: 'app-choose-poli',
  templateUrl: './choose-poli.component.html',
  styleUrls: ['./choose-poli.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class ChoosePoliComponent implements OnInit {
  contentHeader: any
  item: any = {}
  sub: any
  listRuangan: any = []
  listRuanganTemp: any = []
  listBadge: any[] = [
    'bg-light-info', 'bg-light-primary', 'bg-light-danger',
    'bg-light-warning', 'bg-light-success'
  ]

  // private
  private toastRef: any;
  private options: GlobalConfig
  public bookmarkText = '';
  isCetakDSKiosk: any = 'true'
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpservice: HttpService,
    private cacheHelper: CacheService,
    private http: HttpClient,
    private alertService: ToastrService

  ) {
    this.options = this.alertService.toastrConfig;

    let sett = localStorage.getItem('isCetakDS')
    if (sett != null) {
      this.isCetakDSKiosk = sett
    }
  }

  ngOnInit(): void {

    this.contentHeader = {
      headerTitle: 'Pilih Poli',
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

    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.item.jenis = params['jenis'];
        // alert(this.item.jenis)
      });
    this.listRuangan = []
    this.listRuanganTemp = []
    this.httpservice.get('medifirst2000/kiosk/get-ruangan').subscribe(e => {

      let data: any = e
      let x = 0;
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        if (x == 4) {
          x = 0
        } else {
          x = x + 1
        }
        element.badge = this.listBadge[x]
      }
      this.listRuangan = data
      this.listRuanganTemp = data
    })
  }
  pilihRuangan(data) {
    let antrian = {
      "jenis": this.item.jenis,
      "ruanganfk": data.id
    }
    this.httpservice.get('medifirst2000/kiosk/get-slotting-kosong?ruanganfk=' + data.id).subscribe(es => {
      let es2: any = es
      if (es2.status == true) {
        this.httpservice.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
          let res: any
          if (this.isCetakDSKiosk == 'true') {
            this.http.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => { })
          } else {
            window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-antrian?norec='
              + response.noRec
              + '&kdprofile=21', '_blank');
          }

          window.history.back()
        })
      } else {
        this.alertService.info('', es2.status, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
        // this.alertService.info('Info', es2.status)
        return
      }


    })


  }
}
