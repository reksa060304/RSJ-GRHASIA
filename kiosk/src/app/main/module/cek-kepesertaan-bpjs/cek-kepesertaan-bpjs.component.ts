import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../alert.service';
import { CacheService } from '../cache.service';
import { Configuration } from '../config';
import { HttpService } from '../httpService';
@Component({
  selector: 'app-cek-kepesertaan-bpjs',
  templateUrl: './cek-kepesertaan-bpjs.component.html',
  styleUrls: ['./cek-kepesertaan-bpjs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CekKepesertaanBpjsComponent implements OnInit {
  contentHeader: any
  url: any
  sub: any;
  loading: boolean
  formGroup: FormGroup;
  isInfoPasien: boolean = false
  pasien: any = {}
  dataCache: any
  rujukan: any = {}
  item: any = {
    peserta: {
      jenisPeserta: {},
      umur: {},
      mr: {}
    },
    diagnosa: {},
    provPerujuk: {},
    poliRujukan: {}
  }
  listRadio: any[] = [{ name: 'Nomor Kartu', id: 'Noka' }, { name: 'NIK', id: 'nik' }];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private service: HttpClient,
    private alertService: ToastrService,
    private msgService: AlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Cek Kepesertaan - Pasien BPJS',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Menu Utama',
            isLink: true,
            link: '/cek-kepesertaan-bpjs'
          },

        ]
      }
    };
    this.formGroup = this.fb.group({
      'noKartu': new FormControl(''),
      'pCare': new FormControl(''),
    })
    this.formGroup.get('pCare').setValue('Noka')
  }
  getInfoPasien() {
    if (this.formGroup.get('noKartu').value == '') {
      this.alertService.warning('', 'DATA BELUM DI ISI', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return;
    }

    var url = "";
    if(this.formGroup.get('pCare').value == 'Noka') {
      url = "Peserta/nokartu/" + this.formGroup.get('noKartu').value + "/tglSEP/" + moment(new Date()).format('YYYY-MM-DD');
    } else {
      url = "Peserta/nik/" + this.formGroup.get('noKartu').value + "/tglSEP/" + moment(new Date()).format('YYYY-MM-DD');
    }

    var json = {
      "url": url,
      "method": "GET",
    }
    this.httpService.post('medifirst2000/bridging/bpjs/tools', json).subscribe(res => {
      if(res.metaData.code === "200") {
        this.alertService.info('', res.metaData.message, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });

        this.isInfoPasien = true;
        this.item = res.response.peserta
        var rujukan = {
          "url": "Rujukan/List/Peserta/" + this.item.noKartu,
          "method": "GET",
        }
        this.httpService.post('medifirst2000/bridging/bpjs/tools', rujukan).subscribe(res2 => {
          if(res.metaData.code === "200") {
            this.rujukan = res2.response.rujukan
          }
        })
        
      } else {
        this.alertService.error('', res.metaData.message, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
        return;
      }
    });

  }

}
