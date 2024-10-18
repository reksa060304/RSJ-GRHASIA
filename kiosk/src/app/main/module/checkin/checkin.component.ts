import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { Configuration } from '../config';
import { HttpService } from '../httpService';
@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class CheckinComponent implements OnInit {
  contentHeader:any
  url: any
  sub: any;
  formGroup: FormGroup;
  isInfoPasien: boolean = false
  item: any = {}
  dataCache: any
  batasJamCheckin=1
  isloading: boolean = false
  constructor(private router: Router,
    private route: ActivatedRoute,
    private httpservice: HttpService,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private service: HttpClient,
    private alertService: ToastrService,) { }

  ngOnInit(): void {
    this.httpservice.get('medifirst2000/sysadmin/general/settingdatafixed/get/batasJamCheckin' ).subscribe(resp => {
      this.batasJamCheckin = resp
    })

    
    this.formGroup = this.fb.group({
      'noReservasi': new FormControl(''),

    })
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.url = params['page'];
      });
    let noreservasi = this.cacheHelper.get('cacheAutoNoReservasi')
    if (noreservasi != undefined) {
      this.formGroup.get('noReservasi').setValue(noreservasi)
      this.getInfoByNoReservasi()
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
  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return  Math.abs(diff);//Math.abs(Math.round(diff));    
  }
  getInfoByNoReservasi() {
    this.isloading =true
    this.httpservice.get('medifirst2000/reservasionline/cek-in-kiosk?noReservasi=' + this.formGroup.get('noReservasi').value).subscribe(e => {
      this.isloading =false
      if (e.data !=null ) {
        let result = e.data
        let now =new Date();// new Date(new Date(tglRes).setHours(new Date(tglRes).getHours() - 1))
        let tglResDate = new Date(result.tanggalreservasi)
        var hours = this.diff_hours(tglResDate, now)
        // if (hours >  this.batasJamCheckin ) {
        //   this.alertService.error('','Check-In hanya bisa dilakukan SATU Jam sebelum jam reservasi', {
        //     toastClass: 'toast ngx-toastr',
        //     closeButton: true,
        //     positionClass: 'toast-bottom-center'
        //   });
        //   return
        // }
        // if (new Date() > new Date(result.tanggalreservasi)) {
        //   this.alertService.error('','Batas Waktu Check-In anda melebihi batas yang ditentukan', {
        //     toastClass: 'toast ngx-toastr',
        //     closeButton: true,
        //     positionClass: 'toast-bottom-center'
        //   });
        //   return
        // }

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
        this.isInfoPasien = true
        this.item = result
        // this.namaPasien = result.namapasien
        // this.jenisKelamin = result.jeniskelamin
        // this.noIdentitas = result.noidentitas
        // this.tempatTglLahir = result.tempatlahir + ', ' + result.tgllahir
        // this.alamat = result.alamatlengkap
        // this.noTelpon = result.notelepon
        // this.idPasien = result.nocmfk

      } else {
        this.isInfoPasien = false
        this.alertService.error('',e.message, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
        // this.alertService.error('Info', 'Data tidak ditemukan')
      }
    }, error => {
      this.isloading =false
      this.isInfoPasien = false
      this.alertService.error('','Data tidak ditemukan', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      // this.alertService.error('Info', 'Data tidak ditemukan')
    })
  }
  cetakBukti() {
    // window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-bukti-pendaftaran?noregistrasi='
    // + this.item.noregistrasi
    // + '&noReservasi=' + this.item.noreservasi
    // + '&kdprofile=21',  '_blank');
    this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran-online=1&norec='
      + this.item.noregistrasi + '&view=false'
      + '&noReservasi=' + this.item.noreservasi).subscribe(response => {
        // do something with response
      });
  }
  checkIn() {
    if (this.item.type == "BARU") {
      this.savePasienPerjanjian()
      return
    }
    if (this.item.objectkelompokpasienfk == 2 && this.item.type != "BARU") {
      this.cacheHelper.set('cacheOnlineBPJS', this.item)
      this.router.navigate(['touchscreen/self-regis/verif-pasien-bpjs'], { queryParams: { page: 'BPJS' } })
      return
    }
    else {
      this.savePasienDaftar()
      return
    }
  }
  savePasienPerjanjian() {

    let antrian = {
      "jenis": this.item.prefixnoantrian//"D"
    }
    this.httpservice.post('medifirst2000/kiosk/save-antrian', antrian).subscribe(response => {
      // window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-antrian?norec='
      // + response.noRec
      // + '&noReservasi=' + this.item.noreservasi
      // + '&kdprofile=21',  '_blank');
      this.service.get('http://127.0.0.1:1237/printvb/cetak-antrian-online?cetak=1&norec=' + response.noRec
        + '&noReservasi=' + this.item.noreservasi).subscribe(result => {
          // do something with response

        })
      window.history.back()
    }, error => {

    })
  }
  savePasienDaftar() {
    var pasiendaftar = {
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'tglregistrasidate': moment(new Date()).format('YYYY-MM-DD'),
      'nocmfk': this.item.nocmfk,
      'objectruanganfk': this.item.objectruanganfk,
      'objectdepartemenfk': this.item.objectdepartemenfk,
      'objectkelasfk': 6,//nonkelas
      'objectkelompokpasienlastfk': this.item.objectkelompokpasienfk != null ? this.item.objectkelompokpasienfk : 1,//umum
      'objectrekananfk': null,
      'tipelayanan': 1,//reguler
      'objectpegawaifk': this.item.objectpegawaifk,
      'noregistrasi': '',
      'norec_pd': this.item.norec_pd != null ? this.item.norec_pd : '',
      'israwatinap': 'false',
      'ischeckin': 'true',
      'statusschedule': this.item.noreservasi// this.formGroup.get('noReservasi').value != '' ? this.formGroup.get('noReservasi').value : '',

    }
    var antrianpasiendiperiksa = {
      'norec_apd': this.item.norec_apd != null ? this.item.norec_apd : '',
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'objectruanganfk': this.item.objectruanganfk,
      'objectkelasfk': 6,//nonkelas
      'objectpegawaifk': this.item.objectpegawaifk,
      'objectkamarfk': null,
      'nobed': null,
      'objectdepartemenfk': this.item.objectdepartemenfk,
      'objectasalrujukanfk': 5,//Datang Sendiri
      'israwatgabung': 0,
    }
    var objSave = {
      'pasiendaftar': pasiendaftar,
      'antrianpasiendiperiksa': antrianpasiendiperiksa
    }

    this.httpservice.post('medifirst2000/registrasi/save-registrasipasien', objSave).subscribe(response => {

      this.item.noregistrasi = response.dataPD.noregistrasi
      this.cetakBukti()
      // if (this.item.objectkelompokpasienfk == 2 && this.item.type != "BARU") {
      //   this.alertService.info('Peringatan','Pastikan SEP Di Cetak di Loket Pendaftaran !!')
      // }
      this.saveLogging('Pendaftaran Pasien', 'norec Pasien Daftar', response.dataPD.norec,
        'Check-In No Registrasi (' + response.dataPD.noregistrasi + ') ')
      this.updateStatusConfirm()
      window.history.back()
    }, error => {

    })
  }
  updateStatusConfirm() {
    let data = {
      "noreservasi": this.item.noreservasi,
    }
    this.httpservice.post('medifirst2000/reservasionline/update-data-status-reservasi', data).subscribe(e => {

    })
  }
  saveLogging(jenis, referensi, noreff, ket) {
    this.httpservice.get("medifirst2000/sysadmin/logging/save-log-all?jenislog=" + jenis
      + "&referensi=" + referensi
      + "&noreff=" + noreff
      + "&keterangan=" + ket
    ).subscribe(e => {

    })
  }
}
