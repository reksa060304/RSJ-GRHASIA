import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { knowledgeBaseService } from 'app/main/pages/kb/knowledge-base/knowledge-base.service';
import * as snippet from 'app/main/components/carousel/carousel.snippetcode';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastService } from 'app/main/components/toasts/toasts.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../httpService';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../config';
// CarouselImages interface
export interface CarouselImages {
  one?: string;
  two?: string;
  three?: string;
  four?: string;
  five?: string;
  six?: string;
}
@Component({
  selector: 'app-touchscreen',
  templateUrl: './touchscreen.component.html',
  styleUrls: ['./touchscreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TouchscreenComponent implements OnInit {
  // public

  public contentHeader: object;
  public searchText: any;
  public data: any;
  model: any

  @ViewChild("scanBarcode") nameBarcode: ElementRef;
  now: any = moment(new Date()).format('DD MMM, YYYY')
  // private
  private _unsubscribeAll: Subject<any>;
  public listImage: any[] = [
    'assets/images/slider/05.jpg',
    'assets/images/slider/06.jpg',
    'assets/images/slider/08.jpg',
  ];
  public carouselImages: CarouselImages = {
    one: 'assets/images/slider/01.jpg',
    two: 'assets/images/slider/02.jpg',
    three: 'assets/images/slider/03.jpg',
    four: 'assets/images/slider/04.jpg',
    five: 'assets/images/slider/05.jpg',
    six: 'assets/images/slider/06.jpg'
  };
  // snippet code variables
  public _snippetCodeBasicExample = snippet.snippetCodeBasicExample;
  public _snippetCodeOptionalCaptions = snippet.snippetCodeOptionalCaptions;
  public _snippetCodeIntervalOption = snippet.snippetCodeIntervalOption;
  public _snippetCodePauseOption = snippet.snippetCodePauseOption;
  public _snippetCodeWrapOption = snippet.snippetCodeWrapOption;
  public _snippetCodeKeyboardOption = snippet.snippetCodeKeyboardOption;
  public _snippetCodeNavigationArrow = snippet.snippetCodeNavigationArrow;
  public _snippetCodeNavigationIndicators = snippet.snippetCodeNavigationIndicators;
  public _snippetCodeCrossfade = snippet.snippetCodeCrossfade;
  public _snippetCodeActiveId = snippet.snippetCodeActiveId;
  /**
   * Constructor
   *
   * @param {knowledgeBaseService} _knowledgeBaseService
   */
  isSave: boolean
  isAktifSlotRuangan: any = 'false'
  isCetakDSKiosk: any = 'true'
  constructor(private _knowledgeBaseService: knowledgeBaseService,
    private _alertService: ToastrService,
    private httpService: HttpService,
    private http: HttpClient,
    private router: Router,) {
    this._unsubscribeAll = new Subject();

    this.httpService.get('medifirst2000/kiosk/get-combo-setting').subscribe(resps => {
      this.isAktifSlotRuangan = resps.isAktifSlotRuanganKiosk
      this.isCetakDSKiosk = resps.isCetakDSKiosk
      localStorage.setItem('isCetakDS', this.isCetakDSKiosk)
    }, error => {
      this.isAktifSlotRuangan = 'false'
      this.isCetakDSKiosk = 'true'
      localStorage.setItem('isCetakDS', this.isCetakDSKiosk)
    })
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Changes
   */
  ngOnInit(): void {
    // this._knowledgeBaseService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.data = response;
    // });


    // content header
    this.contentHeader = {
      headerTitle: 'Kios-K',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: false,
            link: '/kiosk'
          },

        ]
      }
    };
  }
  print(jenis) {
    if (this.isAktifSlotRuangan == 'true') {
      this.router.navigate(['choose-poli'], { queryParams: { jenis: jenis } })
    } else {
      let antrian = {
        "jenis": jenis,
        "ruanganfk": null
      }
      this.isSave = true
      this.httpService.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
        this.isSave = false
        if (this.isCetakDSKiosk == 'false') {
          window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-antrian?norec='
            + response.noRec
            + '&kdprofile=21', '_blank');
        } else {
          this.http.get('http://127.0.0.1:1237/printvb/cetak-antrian?cetak=1&norec=' + response.noRec).subscribe(result => { })
        }


      }, error => {
        this.isSave = false
      })
    }
  }

  goTo(name) {
    this.router.navigate(['touchscreen/' + name]);
  }
  onChangeNoreservasi(value: string) {
    if (value.length == 7) {

    } else {

    }
    alert(value);
  }
  clickBtn(url) {
    this.router.navigate([url]);
    // this._alertService.info('','Under Construction', {
    //   toastClass: 'toast ngx-toastr',
    //   closeButton: true,
    //   positionClass: 'toast-bottom-center'
    // });
  }

cekDanGoTo(name: string) {
  this.httpService.get('medifirst2000/kiosk/get-jam-tutup-hari-ini').subscribe(
    (resps: any) => {
      // Jika respons kosong atau tidak valid
      if (!resps) {
        this._alertService.warning('Gagal mendapatkan informasi jadwal hari ini.');
        return;
      }

      // Jika belum disetting di master
      if (resps.status === false) {
        // this._alertService.warning(resps.message || 'Hari ini belum disetting di master slot.');
        this.goTo(name);
        return;
      }

      const jamServer = moment(resps.waktuServer, 'HH:mm');
      const jamBuka = moment(resps.jamBuka, 'HH:mm');
      const jamTutup = moment(resps.jamTutup, 'HH:mm');

      // Jika masih dalam jam tutup → tidak boleh daftar
      if (!resps.bolehDaftar) {
        this._alertService.warning(resps.message || 'Pendaftaran sedang ditutup.');
        return;
      }

      // Jika sudah lewat jam tutup → boleh daftar
      if (resps.bolehDaftar) {
        this._alertService.info(resps.message || 'Pendaftaran dibuka. Silakan lanjut.');
        this.goTo(name);
        return;
      }

      // Fallback: jika tidak masuk kondisi di atas
      this._alertService.warning('Status jadwal pendaftaran tidak diketahui.');
    },
    error => {
      this._alertService.error('Gagal mengecek jadwal pendaftaran.');

    }
  );
}



  // showPopupFarm = false;
  // noRegFarm = '';

  // @ViewChild('scanInputFarm') scanInputFarm!: ElementRef;

  // openPopup() {
  //   this.showPopupFarm = true;

  //   // Fokus otomatis ke input begitu popup muncul
  //   setTimeout(() => {
  //     this.scanInputFarm?.nativeElement.focus();
  //   }, 100);
  // }

  // closePopup() {
  //   this.showPopupFarm = false;
  // }

  // submitNoRegFarm() {
  //   if (this.noRegFarm) {
  //   console.log('Nomor reservasi:', this.noRegFarm);
  //   // this.closePopup();
  //   window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-antrian-farm?noreg='
  //           + this.noRegFarm
  //           + '&kdprofile=21', '_blank');
      
  //   } else {
  //   alert('Masukan No Registrasi Terlebih Dahulu.');
  //   }
  //   // jalankan logika pencarian / validasi
  //   // this.closePopup();
  // }

}
