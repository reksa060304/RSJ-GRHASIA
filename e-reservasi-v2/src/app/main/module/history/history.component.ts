import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AuthenticationService } from 'app/auth/service';
import { DatatablesService } from 'app/main/tables/datatables/datatables.service';
import moment from 'moment';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CacheService } from '../cache.service';
import { HttpService } from '../httpService';
import QRCode from 'qrcode';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],

  encapsulation: ViewEncapsulation.None,
})
export class HistoryComponent implements OnInit {
  // public
  public contentHeader: object;
  item: any = {}
  isChecked:boolean
  isBarcode:boolean =false
  selectedOption = 10;
  listHistori = []
  resultR:any={}
  tempData:any=[]
  listHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  linkBarcode = 'https://barcode.tec-it.com/barcode.ashx?data='
  barCode: any
  linkBarcode2 = '&code=Code128&dpi=96&dataseparator='
  constructor(private httpservice: HttpService,
    private cacheHelper: CacheService,
    private alertService: ToastrService,
    private _authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'History',
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
            name: 'History Reservasi',
            isLink: false
          }
        ]
      }
    };
    this.load()
  }
  load() {
    let noCM = this._authenticationService.currentUserValue.firstName
    if (this._authenticationService.currentUserValue.pasien != null) {
      noCM = this._authenticationService.currentUserValue.pasien.nocm
    }
    let tglLahirLama = ''
    if (this._authenticationService.currentUserValue.pasien != null) {
      tglLahirLama = moment(new Date(this._authenticationService.currentUserValue.pasien.tgllahir)).format('DD-MM-YYYY')
    } else {
      tglLahirLama = moment(new Date(this._authenticationService.currentUserValue.tgllahir)).format('DD-MM-YYYY')
    }
    let nik = ''
    if (this._authenticationService.currentUserValue.login.nik != null) {
      nik = this._authenticationService.currentUserValue.login.nik
    }

    this.listHistori = []
    this.tempData =[]
    this.httpservice.get('medifirst2000/reservasionline/get-history?nocmNama=' + noCM + '&tgllahir=' + tglLahirLama
      + '&nik=' + nik).subscribe(res => {
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];

          let tglReserDay = new Date(element.tanggalreservasi)
          let _hari = tglReserDay.getDay();
          let hariFix = this.listHari[_hari]
          element.tanggalreservasi = hariFix + ', ' + moment(new Date(element.tanggalreservasi)).format('DD-MMM-YYYY HH:mm') //HH:mm
        }
        this.listHistori = res.data
        this.tempData =res.data
      })
  }
  filterUpdate(e) {
    const val = e.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.namaruangan.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.listHistori = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
  cetak(modalSuccess,items) {

    this.resultR.tgl = items.tanggalreservasi
    this.resultR.tgllahir = moment(new Date(items.tgllahir)).format('DD-MMM-YYYY')
    this.resultR.namapasien = items.namapasien
    this.resultR.noreservasi = items.noreservasi
    this.resultR.namaruangan = items.namaruangan
    this.resultR.jeniskelamin = items.jeniskelamin
    this.resultR.kelompokpasien = items.kelompokpasien
    this.resultR.notelepon = items.notelepon
    this.resultR.isconfirm = items.isconfirm
    this.resultR.barCode = this.linkBarcode + items.noreservasi + this.linkBarcode2
    QRCode.toDataURL(items.noreservasi)
      .then(url => {
        this.resultR.qrCode = url
        console.log(url)
      })
      .catch(err => {
        console.error(err)
      })
    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: 'modal modal-success'
    });
  }
  checkValue(e){
     this.isBarcode =e
  
  }
}
