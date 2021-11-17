import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../app.component';
import * as $ from "jquery";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import * as moment from 'moment'
import { ApiService } from 'src/app/service';
import { CacheService } from 'src/app/service/cache.service';
import { AlertService } from 'src/app/service/component/alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-pilih-poli',
  templateUrl: './pilih-poli.component.html',
  styleUrls: ['./pilih-poli.component.scss']
})
export class PilihPoliComponent implements OnInit {

  url: any
  sub: any;
  formGroup: FormGroup;
  isInfoPasien: boolean = false
  isAdminOtomatisKiosk: any
  showDokter: boolean = true
  listRuangan: any[] = []
  listDokter: any[] = []
  myControl = new FormControl();
  // options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  now: any = new Date()
  dataCache: any;
  item: any = {}
  showNoAntrian: boolean = false
  isPasienBaru: boolean = false
  loading: boolean = false
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: ApiService,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private service: HttpClient,
    private alertService: AlertService,
    ) {

  }
  ngOnInit() {
    this.httpService.get('kiosk/get-combo-setting').subscribe(resps => {

      this.isAdminOtomatisKiosk = resps.isAdminOtomatisKiosk

    }, error => {

      this.isAdminOtomatisKiosk = 'false'
    })
    let cache = this.cacheHelper.get('cacheSelfRegis')
    if (cache != undefined) {
      if (cache[0].idpasien != undefined) {
        this.isPasienBaru = true
      } else {
        if (cache[0].noidentitas == null || cache[0].noidentitas == "")
          cache[0].noidentitas = '-'
        if (cache[0].notelepon == null || cache[0].notelepon == "")
          cache[0].notelepon = '-'
        cache[0].tempatTglLahir = cache[0].tempatlahir + ', ' + cache[0].tgllahir
      }

      // this.item = cache[0]
      this.dataCache = cache
      // this.cacheHelper.set('cacheSelfRegis', undefined);
    }
    this.formGroup = this.fb.group({
      'idRuangan': new FormControl(null),
      'idDokter': new FormControl(null),
      'tglRegis': new FormControl(new Date()),
      'ceklisEkse': new FormControl(null),
    });
    this.httpService.get('kiosk/get-combo-kiosk2?eksek=false').subscribe(e => {
      this.listRuangan = [];
      this.listRuangan.push({ label: '--Pilih Poli --', value: null });
      e.ruanganrajal.forEach(response => {
        this.listRuangan.push({
          label: response.namaruangan, value: {
            'id': response.id,
            'namaruangan': response.namaruangan,
            'objectdepartemenfk': response.objectdepartemenfk
          }
        });
      });
      this.listDokter = [];
      this.listDokter.push({ label: '-- Dokter --', value: null });
      e.dokter.forEach(response => {
        this.listDokter.push({
          label: response.namalengkap, value: {
            'id': response.objectpegawaifk,
            'dokter': response.namalengkap
          }
        });
      });

      // this.filteredOptions = this.myControl.valueChanges
      //   .pipe(
      //     startWith(''),
      //     map(value => this._filter(value))
      //   );

    })
  }

  goBack(){
    window.history.back()
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.listRuangan.filter(option => option.namaruangan.toLowerCase().includes(filterValue));
  }
  viewResume() {
debugger
    this.isInfoPasien = true
    if (this.isPasienBaru == true) {
      this.dataCache[0].nocm = '-'
      this.dataCache[0].namapasien = this.dataCache[0].pasien.namaPasien
      this.dataCache[0].noidentitas = this.dataCache[0].pasien.noIdentitas
      this.dataCache[0].tempatTglLahir = this.dataCache[0].pasien.tempatLahir + ', ' + this.dataCache[0].pasien.tglLahir
      this.dataCache[0].noidentitas = this.dataCache[0].pasien.noIdentitas
      this.dataCache[0].alamatlengkap = this.dataCache[0].alamatLengkap
      this.dataCache[0].notelepon = '-'
      this.dataCache[0].namaruangan = this.formGroup.get('idRuangan').value.namaruangan
      this.dataCache[0].idruangan = this.formGroup.get('idRuangan').value.id
      this.dataCache[0].objectdepartemenfk = this.formGroup.get('idRuangan').value.objectdepartemenfk
      this.dataCache[0].dokter = this.formGroup.get('idDokter').value != null ? this.formGroup.get('idDokter').value.dokter : null
      this.dataCache[0].iddokter = this.formGroup.get('idDokter').value != null ? this.formGroup.get('idDokter').value.id : null
      this.dataCache[0].tglregistrasi = moment(new Date()).format('DD-MM-YYYY HH:mm')
      this.dataCache[0].tipelayanan = this.formGroup.get('ceklisEkse').value != null && this.formGroup.get('ceklisEkse').value == true ? 2 : 1
      this.item = this.dataCache[0]

    } else {
      this.dataCache[0].tglregistrasi = moment(new Date()).format('DD-MM-YYYY HH:mm')
      this.dataCache[0].namaruangan = this.formGroup.get('idRuangan').value.namaruangan
      this.dataCache[0].idruangan = this.formGroup.get('idRuangan').value.id
      this.dataCache[0].dokter = this.formGroup.get('idDokter').value != null ? this.formGroup.get('idDokter').value.dokter : null
      this.dataCache[0].iddokter = this.formGroup.get('idDokter').value != null ? this.formGroup.get('idDokter').value.id : null
      this.dataCache[0].objectdepartemenfk = this.formGroup.get('idRuangan').value.objectdepartemenfk
      this.dataCache[0].tipelayanan = this.formGroup.get('ceklisEkse').value != null && this.formGroup.get('ceklisEkse').value == true ? 2 : 1
      this.item = this.dataCache[0]
    }


  }
  save() {
    // this.httpService.get('kiosk/get-slotting-kosong?ruanganfk=' + this.item.idruangan).subscribe(es => {
    //   if (es.status == true) {
        this.lanjutSave()
      // } else {
        // this.alertService.info('Info', es.status)
        // return
      // }
    // })
  }
  lanjutSave() {
    if (this.isPasienBaru == true) {
      this.httpService.post('registrasi/save-pasien-fix', this.item).subscribe(e => {
        this.item.nocmfk = e.data.kodeexternal
        this.item.statuspasien = 'BARU'
        this.savePsienDaftar()
      })
    } else {
      this.item.statuspasien = 'LAMA'
      this.savePsienDaftar()
    }
  }
  savePsienDaftar() {
    var pasiendaftar = {
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'tglregistrasidate': moment(new Date()).format('YYYY-MM-DD'),
      'nocmfk': this.item.nocmfk,
      'objectruanganfk': this.item.idruangan,
      'objectdepartemenfk': this.item.objectdepartemenfk,
      'objectkelasfk': 6,//nonkelas
      'objectkelompokpasienlastfk': 1,//umum
      'objectrekananfk': null,
      'tipelayanan': this.item.tipelayanan,//reguler
      'objectpegawaifk': this.item.iddokter,
      'noregistrasi': '',
      'norec_pd': '',
      'israwatinap': 'false',
      'statusschedule': 'Kios-K',
      'statuspasien': this.item.statuspasien,
    }
    var antrianpasiendiperiksa = {
      'norec_apd': '',
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'objectruanganfk': this.item.idruangan,
      'objectkelasfk': 6,//nonkelas
      'objectpegawaifk': this.item.iddokter,//this.item.iddokter,
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
    this.loading = true
    this.httpService.post('registrasi/save-registrasipasien', objSave).subscribe(response => {
      this.showNoAntrian = true
      this.item.noregistrasi = response.dataPD.noregistrasi
      this.item.norec_pds = response.dataPD.norec
      this.item.norec_apds = response.dataAPD.norec
      this.saveLogging('Pendaftaran Pasien', 'norec Pasien Daftar', response.dataPD.norec,
        'Self Registration No Registrasi (' + response.dataPD.noregistrasi + ') ')
      if (this.isAdminOtomatisKiosk == 'true') {
        this.saveAdminAuto(this.item)
      }
      this.cacheHelper.set('cacheSelfRegis', undefined)
      this.loading = false
    }, error => {
      this.loading = false
      this.showNoAntrian = false
    })
  }
  saveAdminAuto(pd) {
    let json = {
      norec: pd.norec_pds,
      norec_apd: pd.norec_apds
    }
    this.httpService.post("registrasi/save-adminsitrasi", json).subscribe(z => {

    })
  }
  saveLogging(jenis, referensi, noreff, ket) {
    this.httpService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
      + "&referensi=" + referensi
      + "&noreff=" + noreff
      + "&keterangan=" + ket
    ).subscribe(e => {

    })
  }
  nomorAntrian() {
    let petugas = '-'
    this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec='
      + this.item.noregistrasi + '&petugas=' + petugas + '&view=false').subscribe(response => {
        // do something with response
      });
  }
  changeClick() {
    let eks = false
    if (this.formGroup.get('ceklisEkse').value == true)
      eks = true
    else
      eks = false
    this.listRuangan = [];
    this.httpService.get('kiosk/get-combo-kiosk2?eksek=' + eks).subscribe(e => {
      this.listRuangan = [];
      this.listRuangan.push({ label: '--Pilih Poli --', value: null });
      e.ruanganrajal.forEach(response => {
        this.listRuangan.push({
          label: response.namaruangan, value: {
            'id': response.id,
            'namaruangan': response.namaruangan,
            'objectdepartemenfk': response.objectdepartemenfk
          }
        });
      });
    })
  }
  changePoli(event) {
    this.listDokter = [];
    this.httpService.get("kiosk/get-daftar-jadwal-dokter?ruanganId=" + event.value.id).subscribe(data => {
      if (data.data.length > 0) {
        this.listDokter = [];
        this.listDokter.push({ label: '-- Dokter --', value: null });
        data.data.forEach(response => {
          this.listDokter.push({
            label: response.namalengkap, value: {
              'id': response.objectpegawaifk,
              'dokter': response.namalengkap
            }
          });
        });
      }
      else {
        this.listDokter = [];
        this.alertService.info('Info', 'Dokter DPJP tidak ada / Belum di Jadwalkan')
      }

    });
  }
}