import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AuthenticationService } from 'app/auth/service';
import { DatatablesService } from 'app/main/tables/datatables/datatables.service';
import moment from 'moment';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CacheService } from '../cache.service';
import { HttpService } from '../httpService';

@Component({
  selector: 'app-daftar-tagihan',
  templateUrl: './daftar-tagihan.component.html',
  styleUrls: ['./daftar-tagihan.component.scss'],

  encapsulation: ViewEncapsulation.None,
})
export class DaftarTagihanComponent implements OnInit {
  public contentHeader: object;
  public item: any = {
    dari: { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() },
    sampai: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }
  }
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public dataSource = []
  public _unsubscribeAll;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  // this.item.dari = moment(today.setDate(today.getDate() - 7)).format('YYYY-MM-DD')
  // this.item.sampai = moment(today).format('YYYY-MM-DD')
  today = new Date()
  public basicDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'Y-m-j',
    defaultDate: moment(this.today.setDate(this.today.getDate() - 7)).format('YYYY-MM-DD')
  };
  public basicDateOptions2: FlatpickrOptions = {
    altInput: true,
    altFormat: 'Y-m-j',
    defaultDate: moment(new Date()).format('YYYY-MM-DD')
  };
  email:any
  va: any = {}
  public listStatus = [
    {
      name: 'Belum Dibayar',
      id: 'N'
    },
    {
      name: 'Dibayar',
      id: 'Y'
    },
    {
      name: 'Kadaluarsa',
      id: 'E'
    },
  ]
  public SelectionType = SelectionType;
  constructor(private httpservice: HttpService,
    private cacheHelper: CacheService,
    private alertService: ToastrService,
    private _authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    public formatter: NgbDateParserFormatter,
  ) {
    if (this._authenticationService.currentUserValue.pasien != null) {
      this.item = this._authenticationService.currentUserValue.pasien
      this.item.dari = { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() }
      this.item.sampai = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }
      var today = new Date()

    }
    this.email = this._authenticationService.currentUserValue.email
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.contentHeader = {
      headerTitle: 'Daftar Tagihan',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },

          {
            name: 'Daftar Tagihan',
            isLink: false
          }
        ]
      }
    };
    this.cari()
  }
  formatRupiah(value, currency) {
    return currency + "" + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
  cari() {
    let dari = '', sampai = '', nostruk = '', status = ''
    if (this.item.dari != undefined) {
      dari = this.formatter.format(this.item.dari) + ' 00:00'
    }
    if (this.item.sampai != undefined) {
      sampai = this.formatter.format(this.item.sampai) + ' 23:59'
    }
    if (this.item.nostruk != undefined) {
      nostruk = this.item.nostruk
    }
    if (this.item.status != undefined) {
      status = this.item.status.id
    }
    this.dataSource = []
    this.httpservice.get('medifirst2000/reservasionline/get-status-va?dari=' + dari
      + '&sampai=' + sampai + '&nostruk='
      + nostruk + '&statusB=' + status
      +'&email='+ this.email ).subscribe(res => {
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            res[i].no = i + 1
            res[i].total = this.formatRupiah(res[i].trx_amount, 'Rp. ')
            if (res[i].datetime_payment != null) {
              res[i].stat = 'Sudah dibayar'
            } else if (new Date() > new Date(res[i].datetime_expired) && res[i].datetime_payment == null) {
              res[i].stat = 'Kadaluarsa'
            } else {
              res[i].stat = 'Belum dibayar'
            }
          }
          this.dataSource = res
        } else {
          this.alertService.info('', 'Data Tidak ditemukan', {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
          });
        }
      })
  }
  selectBtn(select, modalSuccess) {
    if (select.bank == 'BRI') {
      let va = select.virtual_account.substring(5)
      let briva = select.virtual_account.substring(0, 5)

      this.httpservice.get('medifirst2000/bri/va/get?institutionCode=J104408&brivaNo=' + briva + '&custCode=' + va).subscribe(res => {
        if (res.responseCode == '00') {
          this.va.noVa = res.data.BrivaNo + res.data.CustCode
          this.va.nostruk = select.nostruk
          this.va.Keterangan = res.data.Keterangan
          this.va.expiredDate = res.data.expiredDate
          this.va.totalbayar = 'Rp. 0'

          this.va.titleStatus = 'Batas Pembayaran'
          if (res.data.statusBayar == 'Y') {
            this.va.titleStatus = 'Tanggal Pembayaran'
            this.va.status = 'Sudah dibayar'
            this.va.totalbayar = this.formatRupiah(parseFloat(res.data.Amount), 'Rp. ')

            if (select.nosbm == null) {
              this.updatePembayaran(select, parseFloat(res.data.Amount), res.data.expiredDate)
            }
          } else if (new Date() > new Date(res.data.expiredDate) && res.data.statusBayar == 'N') {
            this.va.status = 'Kadaluarsa'
          } else {
            this.va.status = 'Belum dibayar'
          }

          this.modalService.open(modalSuccess, {
            centered: true,
            windowClass: 'modal modal-success'
          });
        } else {
          this.alertService.info('', res.errDesc, {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
          });
        }

      })
    }
    if (select.bank == 'BNI') {
      this.httpservice.postAPI('medifirst2000/bni/inquiry-billing', {
        "type": "inquirybilling",
        "client_id": select.client_id,
        "trx_id": select.trx_id,
      }).subscribe(res => {
        if (res.status == '000') {
          this.va.noVa = res.data.virtual_account
          this.va.nostruk = select.nostruk
          this.va.Keterangan = res.data.description

          this.va.totalbayar = 'Rp. 0'
          if (res.data.datetime_payment != null) {
            this.va.status = 'Sudah dibayar'
            this.va.totalbayar = this.formatRupiah(parseFloat(res.data.payment_amount), 'Rp. ')
            // if (select.nosbm == null) {
            //   this.updatePembayaran(select,parseFloat(res.data.Amount),res.data.expiredDate)
            // }
            this.va.titleStatus = 'Tanggal Pembayaran'
            this.va.expiredDate = res.data.datetime_payment

          } else if (new Date() > new Date(res.data.datetime_expired) && res.data.datetime_payment == null) {
            this.va.status = 'Kadaluarsa'
            this.va.titleStatus = 'Batas Pembayaran'
            this.va.expiredDate = res.data.datetime_expired
          } else {
            this.va.titleStatus = 'Batas Pembayaran'
            this.va.expiredDate = res.data.datetime_expired
            this.va.status = 'Belum dibayar'
          }

          this.modalService.open(modalSuccess, {
            centered: true,
            windowClass: 'modal modal-success'
          });
        } else {
          this.alertService.info('', res.message, {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
          });
        }

      })
    }

  }
  updatePembayaran(select, jmlbiaya, expiredDate) {
    let tgl = new Date(new Date(expiredDate).setMinutes(new Date(expiredDate).getMinutes() - 30))

    let json =
    {
      "parameterTambahan": {
        "noRecStrukPelayanan": select.norec_sp,
        "tipePembayaran": "tagihanPasien"
      },
      "isVA": true,
      "jumlahBayar": jmlbiaya,
      "biayaAdministrasi": 0,
      "diskon": 0,
      "tglsbm": moment(tgl).format('YYYY-MM-DD HH:mm:ss'),
      "pembayaran": [
        {
          "nominal": jmlbiaya,
          "caraBayar":
            { "id": 9, "caraBayar": "VIRTUAL ACCOUNT" }
        }]
    }
    this.httpservice.postAPI('medifirst2000/kasir/simpan-data-pembayaran', json).subscribe(e => {

    })
  }

}
