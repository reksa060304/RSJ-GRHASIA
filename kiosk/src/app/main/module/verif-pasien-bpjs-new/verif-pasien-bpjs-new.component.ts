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
  selector: 'app-verif-pasien-bpjs-new',
  templateUrl: './verif-pasien-bpjs-new.component.html',
  styleUrls: ['./verif-pasien-bpjs-new.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerifPasienBpjsNewComponent implements OnInit {
  contentHeader: any
  url: any
  sub: any;
  loading: boolean
  formGroup: FormGroup;
  isInfoPasien: boolean = false
  pasien: any = {}
  dataCache: any
  item: any = {
    peserta: {
      jenisPeserta: {},
      umur: {},
      mr: {}
    },
    diagnosa: {},
    provPerujuk: {},
    poliRujukan: {},
    antrol: {}
  }
  pasienDaftar: any = {}
  pemAsuransi: any = {}
  dataSEP: any = {}
  diagnosa: any = {}
  listDokter: any[] = []
  listDokterMelayani: any[] = []
  listRujukan: any[] = []
  listTujuanKun: any[] = []
  listFlag: any[] = []
  listPenunjang: any[] = []
  listAsses: any[] = []
  listHistori: any[] = []
  isTemporaryBrigding: string
  showCetak: boolean = false
  showSimpan: boolean = true
  showCetakAntrian: boolean = false
  isSuksesSEP: boolean = false
  ppkPelayananRS: any = "0240R008"
  listPoli: any[] = []
  listPoliTemp: any = []
  listDokTemp: any = []
  noSKDP: any
  noReservasi: any
  isAdminOtomatisKiosk: any
  isStatusPasien: any
  showPasca: boolean = true
  kodeDokter: any = null
  eksekutif: any = 1
  test: any = "PILIH DPJP LAYAN"
  tests: any = "PILIH POLI"
  noPascaRanap: any
  item1: any = {}
  showPenjagaan: boolean = false
  showGantiDokter: boolean
  showGantiPoli: boolean
  isSave: boolean = false
  CurrentPage: string;
  CurrentPages: string;
  buttons: any[] = []
  buttonss: any[] = []
  model: any = {}
  showDPJP: boolean
  isInternal:boolean
  isCetakDSKiosk: any = 'true'
  cekPasienDaftar: any = []
  cekPasienDaftarBPJS: any = []
  constructor(private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private service: HttpClient,
    private alertService: ToastrService,
    private msgService: AlertService,
    private modalService: NgbModal
  ) { 
    let sett = localStorage.getItem('isCetakDS')
    if (sett != null) {
      this.isCetakDSKiosk = sett
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Self Registration - Pasien BPJS',
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
    this.httpService.get('medifirst2000/kiosk/get-combo-setting').subscribe(resps => {
      this.ppkPelayananRS = resps.ppkpelayanan
      this.isTemporaryBrigding = resps.isTemporaryBrigding
      this.isAdminOtomatisKiosk = resps.isAdminOtomatisKiosk

    }, error => {
      this.isTemporaryBrigding = 'false'
      this.isAdminOtomatisKiosk = 'false'
      this.ppkPelayananRS = '0240R008'
    })
    this.cacheHelper.set('cacheSelfRegis', undefined);
    this.formGroup = this.fb.group({
      'noRujukan': new FormControl(''),
      'dokterDPJP': new FormControl(''),
      'multiRujukan': new FormControl(''),
      'pCare': new FormControl(''),
      'rumahSakit': new FormControl(''),
      'poliTujuan': new FormControl(''),
      'allDPJP': new FormControl(null),
      'pascaRanap': new FormControl(''),
      'dokterDPJPMelayani': new FormControl(''),
      'tujuanKunj': new FormControl(''),
      'flagProcedure': new FormControl(''),
      'kdPenunjang': new FormControl(''),
      'assesmentPel': new FormControl(''),
      'noSKDP': new FormControl(''),
    })
    this.formGroup.get('pCare').setValue('pcare')
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.url = params['page'];
      });
    var listTujuan = [
      { id: "0", name: "Normal" },
      { id: "1", name: "Prosedur" },
      { id: "2", name: "Konsul Dokter" },
    ]
    this.listTujuanKun = [];
    this.listTujuanKun.push({ label: '-- Tujuan Kunjungan --', value: null });

    listTujuan.forEach(response => {
      this.listTujuanKun.push({
        label: response.name, value: {
          'kode': response.id,
          'nama': response.name,
        }
      });
    });

    var listFlag = [
      {
        id: "0", name: "Prosedur Tidak Berkelanjutan",
        details: [
          { id: "7", name: "Laboratorium" },
          { id: "8", name: "USG" },
          { id: "11", name: "MRI" },
          { id: "9", name: "Farmasi" },
          { id: "10", name: "Lain-Lain" },
        ]
      },
      {
        id: "1", name: "Prosedur dan Terapi Berkelanjutan",
        details: [
          { id: "1", name: "Radioterapi" },
          { id: "2", name: "Kemoterapi" },
          { id: "3", name: "Rehabilitasi Medik" },
          { id: "4", name: "Rehabilitasi Psikososial" },
          { id: "5", name: "Transfusi Darah" },
          { id: "6", name: "Pelayanan Gigi" },
          { id: "12", name: "HEMODIALISA" },
        ]
      },
      // { id: "2", name: "Konsul Dokter" },
    ]
    this.listFlag = [];
    this.listFlag.push({ label: '-- Flag Procedure --', value: null });

    listFlag.forEach(response => {
      this.listFlag.push({
        label: response.name, value: {
          'kode': response.id,
          'nama': response.name,
          'details': response.details,
        }
      });
    });

    var listAsesmen = [
      { id: "1", name: "Poli spesialis tidak tersedia pada hari sebelumnya" },
      { id: "2", name: "Jam Poli telah berakhir pada hari sebelumnya" },
      { id: "3", name: "Dokter Spesialis yang dimaksud tidak praktek pada hari sebelumnya" },
      { id: "4", name: "Atas Instruksi RS" },
      { id: "5", name: "Tujuan Kontrol" },
    ]

    this.listAsses = []
    this.listAsses.push({ label: '-- Assesment --', value: null });

    listAsesmen.forEach(response => {
      this.listAsses.push({
        label: response.name, value: {
          'kode': response.id,
          'nama': response.name,
        }
      });
    });

    this.httpService.get('medifirst2000/bridging/bpjs/get-daftar-poli-internal').subscribe(response => {
      this.listPoli = [];
      this.buttonss = [];
      this.listPoli.push({ label: '-- Poli --', value: null });
      response.forEach(response => {
        this.listPoli.push({
          label: response.namaruangan, value: {
            'kode': response.kdinternal,
            'nama': response.namaruangan,
            'kodeinternal': response.id,
            'objectdepartemenfk': response.objectdepartemenfk,
            'iseksekutif': response.iseksekutif,
          }
        });

        this.buttonss.push({
          label: response.namaruangan, value: {
            'kode': response.kdinternal,
            'nama': response.namaruangan,
            'kodeinternal': response.id,
            'objectdepartemenfk': response.objectdepartemenfk,
            'iseksekutif': response.iseksekutif,
          }
        });

      });
      this.listPoliTemp = response

    }, error => {
      this.buttonss = [];
      this.listPoli = [];
      this.listPoliTemp = []
    })

    let cacheOnlineBPJS = this.cacheHelper.get('cacheOnlineBPJS')
    if (cacheOnlineBPJS != undefined) {
      this.formGroup.get('noRujukan').setValue(cacheOnlineBPJS.nobpjs)
      this.noReservasi = cacheOnlineBPJS.noreservasi
      this.pasienDaftar.norec_pd = cacheOnlineBPJS.norec_pd
      this.pasienDaftar.norec_apd = cacheOnlineBPJS.norec_apd
      this.pasienDaftar.ismobilejkn = cacheOnlineBPJS.ismobilejkn
      this.pasienDaftar.nobpjs = cacheOnlineBPJS.nobpjs
      if (cacheOnlineBPJS.norujukan != undefined && cacheOnlineBPJS.norujukan != null && cacheOnlineBPJS.norujukan != '') {
    
        var jsons = {
          "url": "RencanaKontrol/noSuratKontrol/" + cacheOnlineBPJS.norujukan,
          "method": "GET",
          "data": null
        }
        this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", jsons).subscribe(e => {
          if (e.metaData.code === "200") {
            this.formGroup.get('noRujukan').setValue(e.response.sep.provPerujuk.noRujukan)
            this.cacheHelper.set('cacheOnlineBPJS', undefined)
            this.getNoRujukan()
          }else {
            this.alertService.error('INFO', e.metaData.message);
            return
  
          }
        })
        return
      }
      this.cacheHelper.set('cacheOnlineBPJS', undefined)
      this.getNoRujukan()
    }

    this.formGroup.get('tujuanKunj').setValue(this.listTujuanKun[1])
  }

  getNoRujukan() {
    if (this.formGroup.get('noRujukan').value == '') {
      this.alertService.warning('', 'DATA BELUM DI ISI', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
    }

    let nomor = this.formGroup.get('noRujukan').value
    if (this.isTemporaryBrigding == 'true') {
      this.getNoKaTemporaryBrigding()
    } else {
      if (this.pasienDaftar.nobpjs) {
        this.cekPesertaByNoKartu(this.pasienDaftar.nobpjs)
      } else {
        this.cekPesertaByNoKartu(this.formGroup.get('noRujukan').value)
      }
    }
  }

  getNoKaTemporaryBrigding() {
    this.listDokter = []
    this.httpService.get('medifirst2000/kiosk/get-combo-dokter-temp').subscribe(sa => {
      this.listDokter.push(
        {
          label: '-- Dokter -- ',
          value: null
        })
      sa.forEach(element => {
        this.listDokter.push({
          label: element.nama,
          value: {
            'kode': element.kode,
            'nama': element.nama
          }
        })
      });
    }, error => {
      this.listDokter = [
        {
          label: '-- Dokter -- ',
          value: null
        }, {
          label: 'DR.I NYOMAN DWIJA PUTRA, SP.B',
          value: {
            'kode': '1',
            'nama': 'DR.I NYOMAN DWIJA PUTRA, SP.B'
          }
        },
        {
          label: 'dr. Devi Rina M Tarigan',
          value: {
            'kode': '2',
            'nama': 'dr. Devi Rina M Tarigan'
          }
        },
        {
          label: 'VERRA',
          value: {
            'kode': '3',
            'nama': 'VERRA'
          }
        }
      ];
    })
    this.getJSON('rujukan').subscribe(e => {
      let res = e.response
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        let nomorPembanding = ''
        if (this.formGroup.get('noRujukan').value.toString().length <= 14 && this.formGroup.get('noRujukan').value.toString().length > 6)
          nomorPembanding = element.rujukan.peserta.noKartu
        else if (this.formGroup.get('noRujukan').value.toString().length == 6)
          nomorPembanding = element.rujukan.peserta.mr.noMR
        else
          nomorPembanding = element.rujukan.noKunjungan

        if (nomorPembanding == this.formGroup.get('noRujukan').value) {
          element.rujukan.tglKunjungan = moment(new Date()).format('YYYY-MM-DD')
          this.item = element.rujukan;
          if (element.rujukan.peserta.mr.noMR != null)
            this.getPasienByNoCM(element.rujukan.peserta.mr.noMR)
          else
            element.rujukan.peserta.mr.noMR = '-'
          this.httpService.get('medifirst2000/kiosk/get-ruanganbykode/' + element.rujukan.poliRujukan.kode).subscribe(res => {
            if (res.data != null) {
              // this.formGroup.get('poliTujuan').setValue({
              //   'kode': res.data.kdinternal,
              //   'nama': res.data.namaruangan,
              //   'kodeinternal': res.data.id,
              //   'objectdepartemenfk': res.data.objectdepartemenfk,
              //   'iseksekutif': res.data.iseksekutif,
              // })

              this.formGroup.get('poliTujuan').setValue({
                label: res.data.namaruangan, value: {
                  iseksekutif: res.data.iseksekutif,
                  kode: res.data.kdinternal,
                  kodeinternal: res.data.id,
                  nama: res.data.namaruangan,
                  objectdepartemenfk: res.data.objectdepartemenfk
                }
              })
              this.changePoli({ value: { kode: res.data.kdinternal } })
              this.pasienDaftar.idruangan = res.data.id
              this.pasienDaftar.objectdepartemenfk = res.data.objectdepartemenfk
            }

          })
          this.getDiagnosaByKode(element.rujukan.diagnosa.kode)

          // this.diagnosa.kddiagnosa = 'R62.0'
          // this.diagnosa.id = 6164



          // this.getRuanganInternal(this.item.poliRujukan.kode)
          // this.getDiagnosaByKode(this.item.diagnosa.kode)
          // get Dokter DPJP By Histori
          // this.getHistoriPelayananPesesta(element.rujukan.peserta.noKartu)
          // end Histori
          this.isInfoPasien = true
          this.alertService.info('', 'Status Peserta ' + element.rujukan.peserta.statusPeserta.keterangan, {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
          });
          // this.alertService.info('Status Peserta', element.rujukan.peserta.statusPeserta.keterangan);
          break
        }
      }
    });
  }

  cekPesertaByNoKartu(noKa) {
    this.isInternal = false
    this.showPasca = true
    
    let jsonPeserta = {
      url: '/Peserta/nokartu/' + noKa + '/tglSEP/' + moment(new Date()).format('YYYY-MM-DD'),
      method: 'GET',
      data: null
    }

    this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonPeserta).subscribe(respPeserta => {
      if (respPeserta.metaData.code == 200) {
        this.item.peserta = respPeserta.response.peserta
        this.getPasienByNoCM(this.item.peserta.mr.noMR)
        this.cekRujukanByNoka(this.item.peserta.noKartu)
        this.getHistoriPelayananPesesta(this.item.peserta.noKartu)
        this.formGroup.get('tujuanKunj').setValue(this.listTujuanKun[3])
        this.formGroup.get('assesmentPel').setValue(this.listAsses[5])
        this.isInfoPasien = true
      } else {
        this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', respPeserta.metaData.message);
        this.isInfoPasien = false
        return
      }
    })
  }

  cekPesertaByNoRujukan(noKa) {
    this.showPasca = true
    let jenis = "rs"
    if (this.formGroup.get('pCare').value == 'pcare')
      jenis = this.formGroup.get('pCare').value

    this.httpService.get('medifirst2000/bridging/bpjs/get-rujukan-' + jenis + '?norujukan=' + noKa).subscribe(e => {
      if (e.metaData.code === "200") {

        this.item = e.response.rujukan;
        if (e.response.rujukan.peserta.mr.noMR != null)
          this.getPasienByNoCM(e.response.rujukan.peserta.mr.noMR)
        for (var i = this.listPoliTemp.length - 1; i >= 0; i--) {
          if (this.listPoliTemp[i].kditernal == this.item.poliRujukan.kode) {
            this.getRuanganInternal(this.item.poliRujukan.kode)
            break
          } else {
            this.getRuanganInternal(this.item.poliRujukan.kode)
            break
          }
        }
        // this.getRuanganInternal(this.item.poliRujukan.kode)
        this.getDiagnosaByKode(this.item.diagnosa.kode)
        this.isInfoPasien = true
 
        this.getHistoriPelayananPesesta(e.response.rujukan.peserta.noKartu)
        // end Histori
        this.alertService.info('Status Peserta', e.response.rujukan.peserta.statusPeserta.keterangan);
        if (e.response.rujukan.peserta.statusPeserta.kode == 6) {
          this.isInfoPasien = false
          this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', e.response.rujukan.peserta.statusPeserta.keterangan);
          return
        } else if (e.response.rujukan.peserta.statusPeserta.kode !== 6) {
          this.alertService.error('BERHASIL', e.response.rujukan.peserta.statusPeserta.keterangan);
        }



        this.alertService.info('Status Peserta', e.response.rujukan.peserta.statusPeserta.keterangan);
      } else {
        this.isInfoPasien = false
        this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', e.metaData.message);
      }

    }, error => {
      this.isInfoPasien = false
      this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', error);
    })
  }

  getPasienByNoCM(nocm) {
    this.httpService.get('medifirst2000/reservasionline/get-pasien/' + nocm + '/null').subscribe(e => {
      if (e.data.length > 0) {
        this.pasien = e.data[0]
        this.cekPasienDaftarDuaKali(this.pasien.nocmfk)
        this.cekPasienDaftarDuaKaliBPJS(this.pasien.nocm)
      } else {
        this.alertService.error('SILAHKAN MENGAMBIL NO ANTRIAN', '');
        this.isInfoPasien = false
        return
      }
    })
  }

  cekPasienDaftarDuaKali(nocm) {
    let tglRegis = moment(new Date()).format('YYYY-MM-DD')
    this.httpService.get('medifirst2000/registrasi/cek-pasien-daftar-duakali?nocm=' + nocm + '&tglregistrasi=' + tglRegis).subscribe(resp => {
      this.cekPasienDaftar = resp.data
    })
  }

  cekPasienDaftarDuaKaliBPJS(nocm) {
    let tglRegis = moment(new Date()).format('YYYY-MM-DD')
    this.httpService.get('medifirst2000/registrasi/cek-pasien-bpjs-daftar?nocm=' + nocm + '&tglRegis=' + tglRegis).subscribe(resp => {
      this.cekPasienDaftarBPJS = resp.data
    })
  }

  async cekRujukanByNoka(noKa) {
    this.showPasca = true
    let tglSkrang = new Date()
    let blnSkrang = tglSkrang.getMonth() + 1
    let thnSkrang = tglSkrang.getFullYear()
    this.item.antrol.jeniskunjungan = 1
    this.item.asalRujukan = 1
    this.item.antrol.nomorreferensi = ''
    this.listRujukan = []
    let jsonRujukan = {
      url: 'Rujukan/List/Peserta/' + noKa,
      method: 'GET',
      data: null
    }
    await this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonRujukan).subscribe(async respRujukan => {
      if (respRujukan.metaData.code == 200) {
        this.item.provPerujuk = respRujukan.response.rujukan[0].provPerujuk
        this.item.diagnosa = respRujukan.response.rujukan[0].diagnosa
        this.item.tglKunjungan = respRujukan.response.rujukan[0].tglKunjungan
        this.item.poliRujukan = respRujukan.response.rujukan[0].poliRujukan
        this.item.noKunjungan = respRujukan.response.rujukan[0].noKunjungan
        this.item.asalRujukan = 1
        this.item.antrol.jeniskunjungan = 1
        this.item.antrol.nomorreferensi = respRujukan.response.rujukan[0].noKunjungan
        respRujukan.response.rujukan.forEach(element => {
          this.listRujukan.push({ 
              label: element.noKunjungan, 
              value: element.diagnosa.kode 
            })
        });
        if (this.listRujukan.length > 0) {
          this.formGroup.get('multiRujukan').setValue(this.listRujukan[0])
        }
        this.getRuanganInternal(respRujukan.response.rujukan[0].poliRujukan.kode)
        this.getDiagnosaByKode(this.item.diagnosa.kode)
      } else {
        let jsonRujukanRS = {
          url: 'Rujukan/RS/List/Peserta/' + noKa,
          method: 'GET',
          data: null
        }
        await this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonRujukanRS).subscribe(respRujukanRS => {
          if (respRujukanRS.metaData.code == 200) {
            this.item.provPerujuk = respRujukanRS.response.rujukan[0].provPerujuk
            this.item.diagnosa = respRujukanRS.response.rujukan[0].diagnosa
            this.item.tglKunjungan = respRujukanRS.response.rujukan[0].tglKunjungan
            this.item.poliRujukan = respRujukanRS.response.rujukan[0].poliRujukan
            this.item.noKunjungan = respRujukanRS.response.rujukan[0].noKunjungan
            this.item.asalRujukan = 2
            this.item.antrol.jeniskunjungan = 4
            this.item.antrol.nomorreferensi = respRujukanRS.response.rujukan[0].noKunjungan
            respRujukanRS.response.rujukan.forEach(element => {
              this.listRujukan.push({ 
                  label: element.noKunjungan, 
                  value: element.diagnosa.kode 
                })
            });
            if (this.listRujukan.length > 0) {
              this.formGroup.get('multiRujukan').setValue(this.listRujukan[0])
            }
            this.getRuanganInternal(respRujukanRS.response.rujukan[0].poliRujukan.kode)
          }
        })
      }

      // Cek JML SEP
      if (this.item.antrol.nomorreferensi == '') {
        this.alertService.info('Info', 'No. Rujukan tidak ditemukan harap pergi ke loket')
        return
      }
      let jsonJmlSep = {
        url: 'Rujukan/JumlahSEP/' + this.item.asalRujukan + '/' + this.item.antrol.nomorreferensi,
        method: 'GET',
        data: null
      }
      await this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonJmlSep).subscribe(async respJmlSep => {
        if (respJmlSep.metaData.code == 200) {
          if (respJmlSep.response.jumlahSEP > 0) {
            let jsonSurkon = {
              url: 'RencanaKontrol/ListRencanaKontrol/Bulan/' + (blnSkrang < 10 ? `0${blnSkrang}` : blnSkrang.toString()) + '/Tahun/' + thnSkrang + '/Nokartu/' + noKa + '/filter/2',
              method: 'GET',
              data: null
            }
            await this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonSurkon).subscribe(respSurkon => {
              if (respSurkon.metaData.code == 200) {
                this.item.kontrol = respSurkon.response.list[0]
                this.formGroup.get('noSKDP').setValue(respSurkon.response.list[0].noSuratKontrol)
                this.item.antrol.jeniskunjungan = 3
                this.item.antrol.nomorreferensi = respSurkon.response.list[0].noSuratKontrol
                this.getRuanganInternal(respSurkon.response.list[0].poliTujuan)
              } else {
                this.alertService.info('Info', 'Surat Kontrol : ' + respSurkon.metaData.message)
              }
            })
          }
        }
      })
  
    })
    
  }

  getHistoriPelayananPesesta(noKartu) {
    // debugger
    let jenisPel = ''
    let kdSpesialis = ''
    this.httpService.get("medifirst2000/bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + noKartu).subscribe(data => {
      if (data.metaData.code == 200) {
        this.listHistori = data.response.histori;
        if (this.listHistori.length > 0) {
          jenisPel = this.listHistori[0].jnsPelayanan
          let kodeNamaPoli = this.listHistori[0].poli
          kodeNamaPoli = encodeURIComponent(kodeNamaPoli)
          if (kodeNamaPoli.length > 0)
            var jsons = {
              "url": "referensi/poli/" + kodeNamaPoli,
              "method": "GET",
              "data": null
            }
          this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", jsons).subscribe(e => {

            if (e.metaData.code == 200) {
              let resPoli = e.response.poli;
              if (resPoli.length > 0) {
                for (let i in resPoli) {
                  if (this.listHistori[0].poli == resPoli[i].nama) {
                    kdSpesialis = resPoli[i].kode
                    break
                  }
                }

                this.httpService.get("medifirst2000/bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
                  + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + kdSpesialis).subscribe(data => {
                    if (data.metaData.code == 200) {
                      this.listDokter = [];
                      this.listDokter.push({ label: '-- Dokter --', value: null });
                      data.response.list.forEach(response => {
                        this.listDokter.push({
                          label: response.nama, value: {
                            'kode': response.kode,
                            'nama': response.nama
                          }
                        });
                      });
                      
                      this.formGroup.get('dokterDPJP').setValue(
                        { 
                          label: this.listDokter[1].value.nama, 
                          value: { kode: this.listDokter[1].value.kode, nama: this.listDokter[1].value.nama } 
                        }
                      )
                    } else {
                      if (data.metaData.code == 201 && kdSpesialis == "HDL") {
                        this.httpService.get("medifirst2000/bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
                          + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + "INT").subscribe(data => {
                            if (data.metaData.code == 200) {
                              this.listDokter = [];
                              this.listDokter.push({ label: '-- Dokter Perujuk --', value: null });
                              data.response.list.forEach(response => {
                                this.listDokter.push({
                                  label: response.nama, value: {
                                    'kode': response.kode,
                                    'nama': response.nama 
                                  }
                                });
                              });
                              this.listDokterMelayani = [];
                              this.buttons = [];
                              this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
                              data.response.list.forEach(response => {
                                this.listDokterMelayani.push({
                                  label: response.nama, value: {
                                    'kode': response.kode,
                                    'nama': response.nama
                                  }
                                });
                                this.buttons.push({
                                  label: response.nama, value: {
                                    'kode': response.kode,
                                    'nama': response.nama
                                  }
                                });
                              });

                            }
                          });
                      } else if (data.metaData.code == 201) {
                        this.httpService.get("medifirst2000/bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
                          + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + "INT").subscribe(data => {
                            if (data.metaData.code == 200) {
                              this.listDokter = [];
                              this.listDokter.push({ label: '-- Dokter Perujuk --', value: null });
                              data.response.list.forEach(response => {
                                this.listDokter.push({
                                  label: response.nama, value: {
                                    'kode': response.kode,
                                    'nama': response.nama
                                  }
                                });
                              });
                              this.listDokterMelayani = [];
                              this.buttons = [];
                              this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
                              data.response.list.forEach(response => {
                                this.listDokterMelayani.push({
                                  label: response.nama, value: {
                                    'kode': response.kode,
                                    'nama': response.nama
                                  }
                                });
                                this.buttons.push({
                                  label: response.nama, value: {
                                    'kode': response.kode,
                                    'nama': response.nama
                                  }
                                });
                              });

                            }
                          });
                      }
                      this.listDokter = []
                      this.listDokterMelayani = [];
                      this.buttons = [];
                      this.alertService.info('Dokter DPJP tidak ada', 'Info')
                    }

                  });
              }
            }

          });
        }
      }
      else {
        this.listDokter = [];
        this.listDokterMelayani = [];
        // this.listDokter.push({ label: '--Pilih Dokter --', value: null });
        this.listHistori = []

      }
    });
    
  }

  getRuanganInternal(kode: any) {
    this.httpService.get('medifirst2000/kiosk/get-ruanganbykode/' + kode).subscribe(res => {
      if (res.data != null) {
        this.listPoli = [];
        this.buttonss = [];
        this.listPoli.push({ label: '-- Poli Tujuan --', value: null });

        this.listPoli.push({
          label: res.data.namaruangan, value: {
            'kode': res.data.kdinternal,
            'nama': res.data.namaruangan,
            'kodeinternal': res.data.id,
            'objectdepartemenfk': res.data.objectdepartemenfk,
            'iseksekutif': res.data.iseksekutif,
          }
        });
        this.buttonss.push({
          label: res.data.namaruangan, value: {
            'kode': res.data.kdinternal,
            'nama': res.data.namaruangan,
            'kodeinternal': res.data.id,
            'objectdepartemenfk': res.data.objectdepartemenfk,
            'iseksekutif': res.data.iseksekutif,
          }
        });
        this.listPoliTemp = this.listPoli

        this.formGroup.get('poliTujuan').setValue({
          label: res.data.namaruangan, value: {
            'kode': res.data.kdinternal,
            'nama': res.data.namaruangan,
            'kodeinternal': res.data.id,
            'objectdepartemenfk': res.data.objectdepartemenfk,
            'iseksekutif': res.data.iseksekutif,
          }
        })
        // this.formGroup.get('poliTujuan').setValue({
        //   'kode': res.data.kdinternal,
        //   'nama': res.data.namaruangan,
        //   'kodeinternal': res.data.id,
        //   'objectdepartemenfk': res.data.objectdepartemenfk,
        //   'iseksekutif': res.data.iseksekutif,
        // })

        this.httpService.get("medifirst2000/bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 2
          + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + kode).subscribe(data => {
            if (data.metaData.code == 200) {
              this.listDokter = [];
              this.listDokter.push({ label: '-- Dokter --', value: null });
              data.response.list.forEach(response => {
                this.listDokter.push({
                  label: response.nama, value: {
                    'kode': response.kode,
                    'nama': response.nama
                  }
                });
              });
              this.listDokterMelayani = [];
              this.buttons = [];
              this.listDokterMelayani.push({ label: '-- Dokter Melayani --', value: null });
              data.response.list.forEach(response => {
                this.listDokterMelayani.push({
                  label: response.nama, value: {
                    'kode': response.kode,
                    'nama': response.nama
                  }
                });
                this.buttons.push({
                  label: response.nama, value: {
                    'kode': response.kode,
                    'nama': response.nama
                  }
                });
              });
            } else {
              this.listDokter = []
              this.listDokterMelayani = [];
              this.buttons = [];
              this.listDokter = []
              this.msgService.info('Dokter DPJP tidak ada', 'Info')
            }

          });
        
        this.changePoli(this.formGroup.get('poliTujuan').value)
        this.pasienDaftar.idruangan = res.data.id
        this.pasienDaftar.objectdepartemenfk = res.data.objectdepartemenfk
      }

    })
  }

  getDiagnosaByKode(kode) {
    this.httpService.get('medifirst2000/kiosk/get-diagnosabykode/' + kode).subscribe(res => {
      this.item.diagnosa.id = res.data.id
      // this.diagnosa = res.data
    })
  }

  changePoli(event) {
    var kdinternal = this.listPoli.find(data => data.value == event.value);
    if (this.showPasca == false) {
      kdinternal = event
    }
    console.log(kdinternal);
    this.httpService.get("medifirst2000/bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 2
      + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + event.value.kode).subscribe(data => {
        if (data.metaData.code == 200) {
          this.listDokter = [];
          this.buttons = [];
          // this.listDokter.push({ label: '-- Dokter --', value: null });
          data.response.list.forEach(response => {
            this.listDokter.push({
              label: response.nama, value: {
                'kode': response.kode,
                'nama': response.nama
              }
            });
            this.buttons.push({
              label: response.nama, value: {
                'kode': response.kode,
                'nama': response.nama
              }
            });
          });

          if (this.item.kontrol != undefined) {
            for (const element of this.buttons) {
              if (element.value.kode == this.item.kontrol.kodeDokter) {
                this.test = element.label
                this.formGroup.get('dokterDPJP').setValue(element)
                this.formGroup.get('dokterDPJPMelayani').setValue(element.value)
              }
            }
          } else {
            this.test = this.listDokter[0].label
            this.formGroup.get('dokterDPJP').setValue(this.listDokter[0])
            this.formGroup.get('dokterDPJPMelayani').setValue(this.listDokter[0].value)
          }

        }
        else {
          this.listDokter = [];
          this.msgService.info('Info', 'Dokter DPJP tidak ada')
        }

      });
  }

  public getJSON(jenis): Observable<any> {
    return this.service.get("assets/jsonbridging/bpjs/" + jenis + ".json")
      .pipe(map(response => response),
        catchError(e => { console.log(e); return Observable.throw(e); }))

  }

  changeNoRujukan(event) {
    if (event.value == null) return
    let noKunjungan = this.listRujukan.find(data => data.value == event.value)
    
    this.cekPesertaByNoRujukan(noKunjungan.label)
  }

  goBack() {
    window.history.back()
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  changeTujuan(e) {
    this.formGroup.get('flagProcedure').setValue('')
    this.formGroup.get('assesmentPel').setValue('')
  }

  showPopUp(modalSuccess) {
    this.modalService.open(modalSuccess, {
      centered: true,
      size: 'xl',
      windowClass: 'modal modal-success'
    });
  }

  showPopUp2(modalSuccess) {
    this.modalService.open(modalSuccess, {
      centered: true,
      size: 'xl',
      windowClass: 'modal modal-success'
    });
  }

  ChangeScreen(button) {
    this.CurrentPage = button;
    this.test = this.CurrentPage['label'];
    this.formGroup.get('dokterDPJP').setValue(this.CurrentPage)
    this.formGroup.get('dokterDPJPMelayani').setValue(this.CurrentPage)
    this.showGantiDokter = false;
    this.modalService.dismissAll();
  }

  save() {
    if (this.pasienDaftar.norec_pd == undefined) {
      if (this.cekPasienDaftar.length > 0 && this.cekPasienDaftar[0].objectruanganlastfk == this.formGroup.get('poliTujuan').value.kodeinternal) {
        this.alertService.info('INFO', 'Anda tidak dapat daftar di Poli yang sama!')
        return
      } else if (this.cekPasienDaftarBPJS.length > 0) {
        this.alertService.info('INFO', 'Anda telah daftar di Poli yang lain pada hari ini!')
        return
      }
      this.savePasienDaftar()
    } else {
      this.savePasienDaftar()
    }
  }

  savePasienDaftar() {
    this.showSimpan = true
    this.kodeDokter = null
    this.httpService.get('medifirst2000/kiosk/get-dokter-internal?kode=' +
      this.formGroup.get("dokterDPJP").value.value.kode).subscribe(e => {
        if (e != false) {
          this.kodeDokter = e.id
        }
        if (this.pasien.nocmfk == undefined) {
          this.isStatusPasien = 'BARU'
          // this.savePasien()
          this.alertService.error('SILAHKAN AMBIL NO ANTRIAN', 'PASIEN BARU');
          return
        } else {
          this.isStatusPasien = 'LAMA'
          // if (this.formGroup.get('poliTujuan').value != '') {
      //   this.httpService.get('medifirst2000/kiosk/get-slotting-kosong?ruanganfk=' + this.formGroup.get('poliTujuan').value.kodeinternal).subscribe(es => {
      //     if (es.status == true) {
        this.savePasienDaftarFix()
        //     } else {
        // this.showSimpan = true
        //       this.alertService.info('Info', es.status)
        //       return
        //     }
        //   })
        // }
        }
      })
  }

  savePasienDaftarFix() {
    var pasiendaftar = {
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'tglregistrasidate': moment(new Date()).format('YYYY-MM-DD'),
      'nocmfk': this.pasien.nocmfk,
      'objectruanganfk': this.formGroup.get('poliTujuan').value.value.kodeinternal, //this.pasienDaftar.idruangan,
      'objectdepartemenfk': this.formGroup.get('poliTujuan').value.value.kodeinternal, //this.pasienDaftar.objectdepartemenfk,
      'objectkelasfk': 6,//nonkelas
      'objectkelompokpasienlastfk': 2,//umum
      'objectrekananfk': 2552,//bpjs
      'tipelayanan': this.eksekutif != undefined ? this.eksekutif : 1,//reguler
      'objectpegawaifk': this.kodeDokter,
      'noregistrasi': this.pasienDaftar.noregistrasi ? this.pasienDaftar.noregistrasi : '',
      'norec_pd': this.pasienDaftar.norec_pd ? this.pasienDaftar.norec_pd : '',
      'israwatinap': 'false',
      'objectruanganasalfk': this.formGroup.get('poliTujuan').value.value.kodeinternal,
      'statusschedule': this.noReservasi != undefined ? this.noReservasi : 'Kios-K',
      'statuspasien': 'LAMA',
      'ischeckin': this.pasienDaftar.ismobilejkn ? this.pasienDaftar.ismobilejkn : false,
    }
    var antrianpasiendiperiksa = {
      'norec_apd': this.pasienDaftar.norec_apd ? this.pasienDaftar.norec_apd : '',
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'objectruanganfk': this.formGroup.get('poliTujuan').value.value.kodeinternal, //this.pasienDaftar.idruangan,
      'objectkelasfk': 6,//nonkelas
      'objectpegawaifk': this.kodeDokter,
      'objectkamarfk': null,
      'nobed': null,
      'objectdepartemenfk': this.formGroup.get('poliTujuan').value.value.objectdepartemenfk, //this.pasienDaftar.objectdepartemenfk,
      'objectasalrujukanfk': 2,//Datang Sendiri
      'israwatgabung': 0,
    }
    var objSave = {
      'pasiendaftar': pasiendaftar,
      'antrianpasiendiperiksa': antrianpasiendiperiksa
    }

    this.httpService.postNonMessage('medifirst2000/registrasi/save-registrasipasien', objSave).subscribe(response => {
      this.showSimpan = true
      this.pasienDaftar.noregistrasi = response.dataPD.noregistrasi
      this.pasienDaftar.norec_pd = response.dataPD.norec
      this.pasienDaftar.tglregistrasi = response.dataPD.tglregistrasi
      this.pasienDaftar.norec_apd = response.dataAPD.norec
      this.pasienDaftar.noantrian = response.dataAPD.noantrian
      this.pasienDaftar.kodebooking = this.noReservasi != undefined ? this.noReservasi : this.pasienDaftar.noregistrasi

      this.showCetakAntrian = true
      this.cetakAntrian()
      this.saveLogging('Pendaftaran Pasien', 'norec Pasien Daftar', response.dataPD.norec,
        'Self Registration No Registrasi (' + response.dataPD.noregistrasi + ') ')
      this.updateStatusConfirm()

      let jsonCekAntrol = {
        url: 'antrean/pendaftaran/kodebooking/' + this.pasienDaftar.kodebooking,
        jenis: 'antrean',
        method: 'GET',
        data: null
      }
      this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonCekAntrol).subscribe(resp => {
        if (resp.metaData.code == 200) {
          this.insertSep()
        } else {
          this.saveAntrol(response.dataPD.norec)
        }
      })
      // this.simpanPemakaianAsuransi()
      if (this.isAdminOtomatisKiosk == 'true') {
        this.saveAdminAuto(this.pasienDaftar)
      }
    }, error => {

    })
  }
  saveAdminAuto(pd) {
    let json = {
      norec: pd.norec_pd,
      norec_apd: pd.norec_apd
    }
    this.httpService.postNonMessage("medifirst2000/registrasi/save-adminsitrasi", json).subscribe(z => {

    })
  }

  saveLogging(jenis, referensi, noreff, ket) {
    this.httpService.get("medifirst2000/sysadmin/logging/save-log-all?jenislog=" + jenis
      + "&referensi=" + referensi
      + "&noreff=" + noreff
      + "&keterangan=" + ket
    ).subscribe(e => {

    })
  }

  simpanPemakaianAsuransi() {

    let kelas: any = ""
    if (this.item.peserta.hakKelas.kode == "1")
      kelas = 3
    else if (this.item.peserta.hakKelas.kode == "2")
      kelas = 2
    else if (this.item.peserta.hakKelas.kode == "3")
      kelas = 1

    let asuransipasien = {
      'id_ap': '',
      'noregistrasi': this.pasienDaftar.noregistrasi,
      'nocm': this.pasien.nocm,
      'alamatlengkap': '',
      'objecthubunganpesertafk': 1,//Peserta
      'objectjeniskelaminfk': this.pasien.objectjeniskelaminfk,
      'kdinstitusiasal': 1,
      'kdpenjaminpasien': 2552,
      'objectkelasdijaminfk': kelas,
      'namapeserta': this.item.peserta.nama,
      'nikinstitusiasal': 1,
      'noasuransi': this.item.peserta.noKartu,
      'alamat': '',
      'nocmfkpasien': this.pasien.nocmfk,
      'noidentitas': this.item.peserta.nik,
      'qasuransi': 2,
      'kelompokpasien': 2,
      'tgllahir': moment(new Date(this.item.peserta.tglLahir)).format('YYYY-MM-DD'),
      'jenispeserta': this.item.peserta.jenisPeserta.keterangan,
      'kdprovider': this.item.provPerujuk.kode,
      'nmprovider': this.item.provPerujuk.nama,
      'notelpmobile': this.item.peserta.mr.noTelepon,
    }
    let asalrujukan = "2"
    if (this.formGroup.get('pCare').value != null) {
      if (this.formGroup.get('pCare').value == 'pcare') {
        asalrujukan = '1'
      } else {
        asalrujukan = '2'
      }
    }
    this.model.statuskunjungan = null
    if (this.formGroup.get("tujuanKunj").value != '' && this.formGroup.get("tujuanKunj").value != null) {
      if (this.formGroup.get("tujuanKunj").value.kode == 0) {
        this.model.statuskunjungan = 1
      }
      if (this.formGroup.get("tujuanKunj").value.kode == 1) {
        this.model.statuskunjungan = 2
      }
      if (this.formGroup.get("tujuanKunj").value.kode == 2) {
        this.model.statuskunjungan = 3
      }

    }
    let pemakaianasuransi = {
      'norec_pa': '',
      'noregistrasifk': this.pasienDaftar.norec_pd,
      'tglregistrasi': moment(new Date(this.pasienDaftar.tglregistrasi)).format('YYYY-MM-DD HH:mm'),
      'diagnosisfk': this.item.diagnosa.id != null ? this.item.diagnosa.id : null,
      'lakalantas': 0,
      'nokepesertaan': this.item.peserta.noKartu,
      'norujukan': this.item.noKunjungan,
      'nosep': this.dataSEP.nosep,
      'tglrujukan': this.item.tglKunjungan,
      'objectdiagnosafk': this.item.diagnosa.id != null ? this.item.diagnosa.id : null,
      'tanggalsep': this.dataSEP.tglSep,
      'catatan': '',
      'lokasilaka': null,
      'penjaminlaka': null,
      'cob': false,
      'katarak': false,
      'keteranganlaka': "",
      'tglkejadian': null,
      'suplesi': false,
      'nosepsuplesi': "",
      'kdpropinsi': null,
      'namapropinsi': null,
      'kdkabupaten': null,
      'namakabupaten': null,
      'kdkecamatan': null,
      'namakecamatan': null,
      'nosuratskdp': this.formGroup.get("noSKDP").value != '' ? this.formGroup.get("noSKDP").value.kode : "",
      'kodedpjp': this.formGroup.get('dokterDPJP').value.value.kode,
      'namadpjp': this.formGroup.get('dokterDPJP').value.value.nama,
      'prolanisprb': null,
      'asalrujukanfk': asalrujukan,
      'kodedpjpmelayani': this.formGroup.get('dokterDPJP').value.value.kode,
      'namadjpjpmelayanni': this.formGroup.get('dokterDPJP').value.value.nama,
      'polirujukankode': this.formGroup.get('poliTujuan').value.value.kode,
      'polirujukannama': this.formGroup.get('poliTujuan').value.value.nama,
      'klsrawatnaik': null,
      'pembiayaan': null,
      'penanggungjawab': null,
      'tujuankunj': this.formGroup.get("tujuanKunj").value != '' && this.formGroup.get("tujuanKunj").value != null ? this.formGroup.get("tujuanKunj").value.kode : null,
      'flagprocedure': this.formGroup.get("flagProcedure").value != '' && this.formGroup.get("flagProcedure").value != null ? this.formGroup.get("flagProcedure").value.kode : null,
      'kdpenunjang': this.formGroup.get("kdPenunjang").value != '' && this.formGroup.get("kdPenunjang").value != null ? this.formGroup.get("kdPenunjang").value.kode : null,
      'assesmentpel': this.formGroup.get("assesmentPel").value != '' && this.formGroup.get("assesmentPel").value != null ? this.formGroup.get("assesmentPel").value.kode : null,
      'statuskunjungan': this.model.statuskunjungan ? this.model.statuskunjungan : null,
      'poliasalkode': this.model.poliasalkode ? this.model.poliasalkode : null,
      'politujuankode': this.model.politujuankode ? this.model.politujuankode : null,
    }


    var objSave = {
      'asuransipasien': asuransipasien,
      'pemakaianasuransi': pemakaianasuransi
    }
    this.httpService.postNonMessage('medifirst2000/registrasi/save-asuransipasien', objSave).subscribe(e => {
      this.showCetak = true
      this.isSuksesSEP = true
      this.cetakSep()
      // this.cetakAntrian()
      // this.router.navigate(['touchscreen']);
    })
  }

  cetakSep() {
    // this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + this.pasienDaftar.noregistrasi + '&view=false').subscribe(e => { });
    window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-sep?noregistrasi=' + this.pasienDaftar.noregistrasi + '&kdprofile=30', '_blank');
  }

  updateStatusConfirm() {
    if (this.pasienDaftar.ismobilejkn) {
      let data = {
        "kodebooking": this.noReservasi,
        "waktu": new Date().getTime()
      }
      this.httpService.postNonMessage('medifirst2000/jkn/save-checkin', data).subscribe(e => { })
    } else {
      let data = {
        "noreservasi": this.noReservasi,
      }
      this.httpService.postNonMessage('medifirst2000/reservasionline/update-data-status-reservasi', data).subscribe(e => { })
    }
  }

  async saveAntrol(registrasipasienfk) {
    let timeRegistrasi = new Date(new Date().getTime() + 3 * 60000).getTime()
    let random = (min, max) => Math.floor(Math.random() * (max - min)) + min
    let timeAntrian = new Date().getTime() - random(100000, 900000)

    let kodeBpjs = this.formGroup.get('poliTujuan').value.kode
    if (this.formGroup.get('poliTujuan').value.kode == null) {
      kodeBpjs = '0'
    }
    let jsonJadwal = {
      url: 'jadwaldokter/kodepoli/' + kodeBpjs + '/tanggal/' + moment(new Date()).format('YYYY-MM-DD'),
      jenis: 'antrean',
      method: 'GET',
      data: null
    }

    let kodeDokterBPJS: any
    await this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonJadwal).subscribe(async respJadwal => {
      if (respJadwal.metaData.code == 200) {
        let kodeDokter = this.formGroup.get('dokterDPJP').value.value.kode
        if (this.formGroup.get('dokterDPJP').value.value.kode == null) {
          kodeDokter = '0'
        }

        for (let i = 0; i < respJadwal.response.length; i++) {
          const element = respJadwal.response[i]
          if (element.kodedokter == kodeDokter) {
            kodeDokterBPJS = {
              jadwal : element.jadwal,
              namadokter : element.namadokter,
              kodedokter : element.kodedokter,
              namaruangan : element.namapoli,
              koderuangan : element.kodesubspesialis
            }
            break
          }
        }
        if (kodeDokterBPJS == undefined && respJadwal.response.length > 0) {
          kodeDokterBPJS = {
            jadwal : respJadwal.response[0].jadwal,
            namadokter : respJadwal.response[0].namadokter,
            kodedokter : respJadwal.response[0].kodedokter,
            namaruangan : respJadwal.response[0].namapoli,
            koderuangan : respJadwal.response[0].kodesubspesialis
          }
        }

        if (kodeBpjs != this.item.poliRujukan.kode) {
          this.item.antrol.jeniskunjungan = 2
        }
        
        let jsonAntrol = {
          url: 'antrean/add',
          jenis: 'antrean',
          method: 'POST',
          data: {
            kodebooking: this.noReservasi ? this.noReservasi : this.pasienDaftar.noregistrasi,
            jenispasien: "JKN",
            nomorkartu: this.item.peserta.noKartu,
            nik: this.item.peserta.nik,
            nohp: this.item.peserta.mr.noTelepon.length < 12 ? this.item.peserta.mr.noTelepon : '1234567890',
            kodepoli: kodeDokterBPJS ? kodeDokterBPJS.koderuangan : "",
            namapoli: kodeDokterBPJS ? kodeDokterBPJS.namaruangan : "",
            pasienbaru: '0',
            norm: this.item.peserta.mr.noMR,
            tanggalperiksa: moment(new Date()).format('YYYY-MM-DD'),
            kodedokter: kodeDokterBPJS ? kodeDokterBPJS.kodedokter : "",
            namadokter: kodeDokterBPJS ? kodeDokterBPJS.namadokter : "", 
            jampraktek: kodeDokterBPJS ? kodeDokterBPJS.jadwal : "",  
            jeniskunjungan: this.item.antrol.jeniskunjungan,
            nomorreferensi: this.item.antrol.nomorreferensi,
            nomorantrean: this.pasienDaftar.noantrian,
            angkaantrean: this.pasienDaftar.noantrian,
            estimasidilayani: new Date().getTime(),
            sisakuotajkn: 0,
            kuotajkn: 0,
            sisakuotanonjkn: 0,
            kuotanonjkn: 0,
            keterangan: ""
          }
        }
        await this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonAntrol).subscribe(respAntrol => {
          if (respAntrol.metaData.code == 200) {
            this.insertSep()
            let jsonTask1 = {
              url: 'antrean/updatewaktu',
              jenis: 'antrean',
              method: 'POST',
              data: {
                kodebooking: this.pasienDaftar.noregistrasi,
                taskid: 1,
                waktu: timeAntrian
              }
            }
            this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonTask1).subscribe(respTask1 => {
              if (respTask1.metaData.code == 200) {
                this.saveMonitoringTaksid(registrasipasienfk, 1, true, timeAntrian);

                let jsonTask2 = {
                  url: 'antrean/updatewaktu',
                  jenis: 'antrean',
                  method: 'POST',
                  data: {
                    kodebooking: this.pasienDaftar.noregistrasi,
                    taskid: 2,
                    waktu: timeRegistrasi
                  }
                }
                this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonTask2).subscribe(respTask2 => {
                  if (respTask2.metaData.code == 200) {
                    this.saveMonitoringTaksid(registrasipasienfk, 2, false, timeRegistrasi);

                    let jsonTask3 = {
                      url: 'antrean/updatewaktu',
                      jenis: 'antrean',
                      method: 'POST',
                      data: {
                        kodebooking: this.pasienDaftar.noregistrasi,
                        taskid: 3,
                        waktu: new Date().getTime()
                      }
                    }
                    this.httpService.postNonMessage('medifirst2000/bridging/bpjs/tools', jsonTask3).subscribe(respTask3 => {
                      if (respTask3.metaData.code == 200) {
                        this.saveMonitoringTaksid(registrasipasienfk, 3, false, new Date().getTime());
                      }
                    })
                  }
                })
              }
            }) 
          } else {
            // this.insertSep()
            this.showSimpan = false
            this.alertService.error('INFO', 'Surat Elegibilitas Peserta gagal dibuat agar menghubungi bagian pendaftaran')
          }
        })
      } else {
        this.insertSep()
      }
    })
    
  }

  saveMonitoringTaksid(registrasipasienfk, taskid, statuskirim, waktu) {
    var jsonmonitoring = {
      "noregistrasifk": registrasipasienfk,
      "taskid": taskid,
      "statuskirim": statuskirim,
      "waktu": waktu
    }
    this.httpService.postNonMessage('medifirst2000/rawatjalan/save-monitoring-taskid', jsonmonitoring).subscribe(e => {})
  }

  insertSep() {
    if (this.isTemporaryBrigding == 'true') {
      this.insertTempBrigding()
    } else {
      /*
      * cek kuota poli
      */
      if (this.formGroup.get('poliTujuan').value == '') {
        this.alertService.error('Peringatan', 'Pilih Poli dahulu')
        return
      }
      if (this.item.peserta.mr.noTelepon == null) {
        this.item.peserta.mr.noTelepon = '12345678'
      } else if (this.item.peserta.mr.noTelepon.length > 12) {
        this.item.peserta.mr.noTelepon = '12345678'
      }
      
      this.insertLiveBridging()
    }
  }

  insertTempBrigding() {
    this.getJSON('sep').subscribe(e => {
      let res = e.response
      for (let i = 0; i < res.length; i++) {
        const element = res[i];
        var nomor = ''
        if (this.formGroup.get('noRujukan').value.length <= 14 && this.formGroup.get('noRujukan').value.length > 6) {
          nomor = this.formGroup.get('noRujukan').value
          if (this.formGroup.get('noRujukan').value.toString().length == 6)
            nomor = this.item.peserta.noKartu
        } else {
          nomor = this.item.peserta.noKartu
        }
        if (element.sep.peserta.noKartu == nomor) {
          this.httpService.get('medifirst2000/bridging/bpjs/generate-sep-dummy?kodeppk=' + this.ppkPelayananRS).subscribe(es => {
            this.dataSEP.nosep = es
            // this.dataSEP.nosep = element.sep.noSep
            this.dataSEP.tglSep = moment(new Date()).format('YYYY-MM-DD')
            this.alertService.success('Status', 'Generate SEP Success. No SEP : ' + this.dataSEP.nosep);
            this.showCetak = true
            this.savePasienDaftar();

          })
          break
        }
      }
    });
  }

  insertLiveBridging() {
    let poliTujuan = ""
    if (this.formGroup.get('poliTujuan').value != '')
      poliTujuan = this.formGroup.get('poliTujuan').value.value.kode

    let eksekutif = "0"
    this.eksekutif = 1
    if (this.formGroup.get('poliTujuan').value != ''
      && this.formGroup.get('poliTujuan').value.value.iseksekutif != undefined
      && this.formGroup.get('poliTujuan').value.value.iseksekutif == true) {
      eksekutif = "1"
      this.eksekutif = 2
    }
    var dataSend = {
      "url": "SEP/2.0/insert",
      "method": "POST",
      "data": {
        "request": {
          "t_sep": {
            "noKartu": this.item.peserta.noKartu,
            "tglSep": moment(new Date()).format('YYYY-MM-DD'),
            "ppkPelayanan": this.ppkPelayananRS,
            "jnsPelayanan": "2",
            "klsRawat": {
              "klsRawatHak": this.item.peserta.hakKelas.kode.toString(),
              "klsRawatNaik": "",
              "pembiayaan": "",
              "penanggungJawab": ""
            },
            "noMR": this.item.peserta.mr.noMR,
            "rujukan": {
              "asalRujukan": this.item.asalRujukan,//RS
              "tglRujukan": this.item.tglKunjungan,
              "noRujukan": this.item.noKunjungan,
              "ppkRujukan": this.item.provPerujuk.kode
            },
            "catatan": "REGISTRASI MANDIRI",
            "diagAwal": this.item.diagnosa.kode,
            "poli": {
              "tujuan": poliTujuan,
              "eksekutif": eksekutif
            },
            "cob": {
              "cob": "0"
            },
            "katarak": {
              "katarak": "0"
            },
            "jaminan": {
              "lakaLantas": "0",
              "noLP": "",
              "penjamin": {
                "tglKejadian": "",
                "keterangan": "",
                "suplesi": {
                  "suplesi": "0",
                  "noSepSuplesi": "",
                  "lokasiLaka": {
                    "kdPropinsi": "",
                    "kdKabupaten": "",
                    "kdKecamatan": ""
                  }
                }
              }
            },
            "tujuanKunj": this.formGroup.get("tujuanKunj").value != '' && this.formGroup.get("tujuanKunj").value != null && this.formGroup.get("tujuanKunj").value.value != null ? this.formGroup.get("tujuanKunj").value.value.kode : "",
            "flagProcedure": this.formGroup.get("flagProcedure").value != '' && this.formGroup.get("flagProcedure").value != null && this.formGroup.get("flagProcedure").value.value != null ? this.formGroup.get("flagProcedure").value.value.kode : "",
            "kdPenunjang": this.formGroup.get("kdPenunjang").value != '' && this.formGroup.get("kdPenunjang").value != null && this.formGroup.get("kdPenunjang").value.value != null ? this.formGroup.get("kdPenunjang").value.value.kode : "",
            "assesmentPel": this.formGroup.get("assesmentPel").value != '' && this.formGroup.get("assesmentPel").value != null && this.formGroup.get("assesmentPel").value.value != null ? this.formGroup.get("assesmentPel").value.value.kode : "",
            "skdp": {
              "noSurat": this.formGroup.get("noSKDP").value != '' && this.formGroup.get("noSKDP").value != null ? this.formGroup.get("noSKDP").value : "",
              "kodeDPJP": this.formGroup.get("dokterDPJP").value != '' && this.formGroup.get("dokterDPJP").value != null && this.formGroup.get("dokterDPJP").value.value != null ? this.formGroup.get("dokterDPJP").value.value.kode : ""
            },
            "dpjpLayan": this.formGroup.get("dokterDPJP").value != '' && this.formGroup.get("dokterDPJP").value != null && this.formGroup.get("dokterDPJP").value.value != null ?
              this.formGroup.get("dokterDPJP").value.value.kode : "",
            "noTelp": this.item.peserta.mr.noTelepon,
            "user": "Xoxo"
          }
        }
      }
    }
    this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", dataSend).subscribe(e => {
      if (e.response != null) {
        this.dataSEP.nosep = e.response.sep.noSep
        this.dataSEP.tglSep = e.response.sep.tglSep

        this.alertService.success('Status', 'Generate SEP Success. No SEP : ' + e.response.sep.noSep);
        // this.savePasienDaftar();
        this.simpanPemakaianAsuransi();

      } else {
        this.alertService.error('Gagal Generate SEP', e.metaData.message);
        console.log(dataSend)
        this.showSimpan = false
      }

    }, err => {
      this.alertService.error('Gagal Generate SEP', JSON.stringify(err));
    });
  }

  cetakAntrian() {
    let petugas = '-'

    if (this.isCetakDSKiosk == 'true') {
      this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec='
        + this.pasienDaftar.noregistrasi + '&petugas=' + petugas + '&view=false').subscribe(response => { });
    } else if (this.isCetakDSKiosk == 'android') {
      this.httpService.get("medifirst2000/report/get-cetak-bukti-pendaftaran?noregistrasi="
        + this.pasienDaftar.noregistrasi
      ).subscribe(e => {
        window.open(
          'https://apps.transmedic.co.id/cetak-antrian?isBukti=true'
          + '&namaProfile=' + Configuration.profile().nama
          + '&alamat=' + Configuration.profile().alamat
          + '&noregistrasi=' + e.noregistrasi
          + '&norm=' + e.norm
          + '&namapasien=' + e.namapasien
          + '&kelompokpasien=' + e.kelompokpasien
          + '&noantrian=' + e.noantrian
          + '&statuspasien=' + e.statuspasien
          + '&tanggalreservasi=' + e.tanggalreservasi
          + '&ruangan=' + e.ruangan
          + '&status=' + e.statusonline
          + '&namadokter=' + e.namadokter
          + '&tglregistrasi=' + e.tglregistrasi
          + '&link=' + Configuration.profile().link
        );
      })
    } else {
      window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-bukti-pendaftaran?noregistrasi='
        + this.pasienDaftar.noregistrasi
        + '&kdprofile=30', '_blank');
    }
  }
}
