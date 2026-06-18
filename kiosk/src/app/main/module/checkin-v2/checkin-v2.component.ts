import { HttpClient } from '@angular/common/http';
import { Component, OnInit,AfterViewInit, ViewEncapsulation,  ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { Configuration } from '../config';
import { HttpService } from '../httpService';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-checkin',
  templateUrl: './checkin-v2.component.html',
  styleUrls: ['./checkin-v2.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class CheckinV2Component implements OnInit , AfterViewInit{
  contentHeader: any
  url: any
  sub: any;
  formGroup: FormGroup;
  isInfoPasien: boolean = false
  item: any = {}
  dataCheckin: any ={}
  dataCache: any
  batasJamCheckin = 1
  isloading: boolean = false

  isCetakDSKiosk: any = 'true'
  isAdminOtomatisKiosk: any
  constructor(private router: Router,
    private route: ActivatedRoute,
    private httpservice: HttpService,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private service: HttpClient,
    private alertService: ToastrService,
    private elementRef: ElementRef,
    private renderer: Renderer2,) {
    let sett = localStorage.getItem('isCetakDS')
    if (sett != null) {
      this.isCetakDSKiosk = sett
    }
  }

  ngOnInit(): void {
    
    this.httpservice.get('medifirst2000/sysadmin/general/settingdatafixed/get/batasJamCheckin').subscribe(resp => {
      this.batasJamCheckin = resp
    })

    
    this.httpservice.get('medifirst2000/kiosk/get-combo-setting').subscribe(resps => {
      this.isAdminOtomatisKiosk = resps.isAdminOtomatisKiosk

    }, error => {
      this.isAdminOtomatisKiosk = 'false'
    })

    this.formGroup = this.fb.group({
      'noReservasi': new FormControl(''),

    })

    

    // this.renderer.listen('document', 'click', (event) => {
    //   // Periksa apakah yang diklik bukanlah input teks
    //   if (!this.elementRef.nativeElement.contains(event.target)) {
    //     // Jika bukan input teks, fokuskan kembali ke input teks
    //     this.setFocusOnInput();
    //   }
    // })

    this.renderer.listen('document', 'click', (event) => {
      
      if (!this.elementRef.nativeElement.contains(event.target)) {
        
        this.focusInput();
      }
    });

    this.addClickListenerToForm()
   
    this.formGroup.get('noReservasi').valueChanges.pipe(
      debounceTime(300) 
    ).subscribe((value: any) => {
      if (value.length == 7) {
        this.getInfoByNoReservasi(value)
      } else if (value.length >280 ) {
        const dataBooking = JSON.parse(atob(value));
        this.formGroup.get('noReservasi').setValue(dataBooking.kodeBooking)
        this.getInfoByNoReservasi(dataBooking.kodeBooking)
        // this.dataCheckin = dataBooking
        // console.log(dataBooking)
      }
    });

    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.url = params['page'];
      });
    let noreservasi = this.cacheHelper.get('cacheAutoNoReservasi')
    if (noreservasi != undefined) {
      this.formGroup.get('noReservasi').setValue(noreservasi)
      this.getInfoByNoReservasi(noreservasi)
      this.cacheHelper.set('cacheAutoNoReservasi', undefined)
    }
    this.contentHeader = {
      headerTitle: 'Check-In Reservasi Online',
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


  addClickListenerToForm() {
    this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
      this.focusInput();
    });
  }

  focusInput() {
    const inputElement: HTMLInputElement = this.elementRef.nativeElement.querySelector('input');
    if (inputElement) {
      inputElement.focus();
    }
  }


  // diff_hours(dt2, dt1) {
  //   var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  //   diff /= (60 * 60);
  //   return Math.abs(diff);//Math.abs(Math.round(diff));    
  // }

  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return diff; 
}


  

  getInfoByNoReservasi(a?: any) {
    if (!a) {
      a = this.formGroup.get('noReservasi').value
    }
    if (!a || a.trim() === '') {
      this.alertService.error('', 'Harap isi No. Reservasi / Kode Booking / Scan QR Code terlebih dahulu!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return;
    }
    this.isloading = true

    this.httpservice.get('medifirst2000/reservasionline/get-history?noReservasi=' + a).subscribe(e => {
      this.isloading = false
      if (e && e.data && e.data.length > 0) {

        let result = e.data[0]
        let now = new Date();// new Date(new Date(tglRes).setHours(new Date(tglRes).getHours() - 1))
        let tglResDate = new Date(result.tanggalreservasi)
        var hours = this.diff_hours(tglResDate, now)
        console.log(hours)
        console.log(result)
        if (hours > this.batasJamCheckin) {
          this.alertService.error('', 'Check-In hanya bisa dilakukan ' + this.batasJamCheckin + ' Jam sebelum jam estimasi pelayanan', {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
          });
          this.formGroup.get('noReservasi').setValue('');
          // this.alertService.error('Info', 'Check-In hanya bisa dilakukan SATU Jam sebelum jam reservasi')
          return
        }
        if (result.objectkelompokpasienfk == 2 && result.isconfirm != true) {
          this.alertService.error('', 'Harap melakukan Check-In pada aplikasi mobil JKN terlebih dahulu!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
          });
          this.formGroup.get('noReservasi').setValue('');
          return
        }
        if (new Date() > new Date(result.tanggalreservasi)) {
          // this.alertService.error('', 'Batas Waktu Check-In anda melebihi batas yang ditentukan', {
          //   toastClass: 'toast ngx-toastr',
          //   closeButton: true,
          //   positionClass: 'toast-bottom-center'
          // });
          // // this.alertService.error('Info', 'Batas Waktu Check-In anda melebihi batas yang ditentukan')
          // return
        }

        if (result.tgllahir == null)
          result.tgllahir = '-'
        else
          result.tgllahir = moment(new Date(result.tgllahir)).format('YYYY-MM-DD')
        if (result.tempatlahir == null)
          result.tempatlahir = '-'
        if (result.alamatlengkap == null)
          result.alamatlengkap = '-'
        if (result.notelepon == null || result.notelepon == "")
          result.notelepon = '-'
        result.tanggalreservasi = moment(new Date(result.tanggalreservasi)).format('YYYY-MM-DD HH:mm')
        // this.isInfoPasien = true
        this.item = result
        this.checkIn()
        // this.namaPasien = result.namapasien
        // this.jenisKelamin = result.jeniskelamin
        // this.noIdentitas = result.noidentitas
        // this.tempatTglLahir = result.tempatlahir + ', ' + result.tgllahir
        // this.alamat = result.alamatlengkap
        // this.noTelpon = result.notelepon
        // this.idPasien = result.nocmfk

      } else {
        this.isInfoPasien = false
        this.alertService.error('', 'Data tidak ditemukan', {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
        // this.alertService.error('Info', 'Data tidak ditemukan')
      }
    }, error => {
      this.isloading = false
      this.isInfoPasien = false
      this.alertService.error('', 'Data tidak ditemukan', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      // this.alertService.error('Info', 'Data tidak ditemukan')
    })
  }
 
  checkIn() {
     // if (this.item.objectkelompokpasienfk == 2 && this.item.type != "BARU") {
    if (this.item.objectkelompokpasienfk == 2) {
      this.cacheHelper.set('cacheOnlineBPJS', this.item)
      // this.cacheHelper.set('cacheOnlineCheckin', this.dataCheckin)
      // let jsonParam = {
      //   "kodebooking": this.item.noreservasi//"D"
      // }
      // this.httpservice.post('medifirst2000/kiosk/save-antrian', jsonParam).subscribe(response => {
      this.router.navigate(['touchscreen/self-regis/verif-pasien-bpjs-v2'], { queryParams: { page: 'BPJS' } })
      return
      // })
     // }
    } else {
      if (this.item.tglcheckin != null) {
        this.alertService.info('Info', 'Anda Sudah Check-In', {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
        });
        let noreg = this.item.noregistrasi;
        this.cetakAntrian(noreg);
        return;
      }
      this.isloading = true;
      let jsonParam = {
        "norec": this.item.norec
      }
      this.httpservice.post('medifirst2000/reservasionline/update-tgl-cekin', jsonParam).subscribe((e: any) => {
        this.isloading = false;
        this.alertService.success('Sukses', 'Check-In Berhasil', {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
        });
        let noreg = e && e.noregistrasi ? e.noregistrasi : this.item.noregistrasi;
        this.cetakAntrian(noreg);
      }, error => {
        this.isloading = false;
      })
    }
  }

  cetakAntrian(noregistrasi?: string) {
    let noreg = noregistrasi ? noregistrasi : this.item.noregistrasi;
    window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-bukti-pendaftaran?noregistrasi='
      + noreg
      + '&kdprofile=30', '_blank');
    this.formGroup.get('noReservasi').setValue('');
    this.isInfoPasien = false;
  }



  ngAfterViewInit(): void {
    this.setFocusOnInput();
  }

  private setFocusOnInput(): void {
    const inputElement = this.elementRef.nativeElement.querySelector('input[type="text"]');
    if (inputElement) {
      inputElement.focus();
    }
  }
}
