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
import { tap } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
@Component({
  selector: 'app-verifikasi-pasien-bpjs',
  templateUrl: './verifikasi-pasien-bpjs.component.html',
  styleUrls: ['./verifikasi-pasien-bpjs.component.scss']
})
export class VerifikasiPasienBpjsComponent implements OnInit {
  url: any
  sub: any;
  formGroup: FormGroup;
  isInfoPasien: boolean = false
  pasien: any = {}
  dataCache: any
  item: any = {}
  pasienDaftar: any = {}
  pemAsuransi: any = {}
  dataSEP: any = {}
  diagnosa: any = {}
  listDokter: SelectItem[]
  listHistori: any[]
  isTemporaryBrigding: string
  showCetak: boolean = false
  isSuksesSEP: boolean = false
  ppkPelayananRS: any = "0240R008"
  listPoli: SelectItem[]
  listPoliTemp: any = []
  listDokTemp: any = []
  noSKDP: any
  noReservasi: any
  isAdminOtomatisKiosk: any
  isStatusPasien: any
  kodeDokter: any = null
  eksekutif: any = 1

  listRadio: any[] = [{ name: 'PCare', id: 'pcare' }, { name: 'Rumah Sakit', id: 'rs' }];
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: ApiService,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private alertService: AlertService,
    private service: HttpClient,) {

  }

  ngOnInit() {

    this.httpService.get('kiosk/get-combo-setting').subscribe(resps => {
      this.ppkPelayananRS = resps.ppkpelayanan
      this.isTemporaryBrigding = resps.isTemporaryBrigding
      this.isAdminOtomatisKiosk = resps.isAdminOtomatisKiosk

    }, error => {
      this.isTemporaryBrigding = 'false'
      this.isAdminOtomatisKiosk = 'false'
      this.ppkPelayananRS = '0240R008'
    })
    this.httpService.get('bridging/bpjs/generateskdp').subscribe(resp => {
      this.noSKDP = resp.noskdp

    })



    this.cacheHelper.set('cacheSelfRegis', undefined);
    this.formGroup = this.fb.group({
      'noRujukan': new FormControl(''),
      'dokterDPJP': new FormControl(''),
      'pCare': new FormControl(''),
      'rumahSakit': new FormControl(''),
      'poliTujuan': new FormControl(''),
      'allDPJP': new FormControl(null),
    })
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.url = params['page'];
      });

    this.httpService.get('bridging/bpjs/get-daftar-poli-internal').subscribe(response => {
      this.listPoli = [];
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
      });
      this.listPoliTemp = response

    }, error => {
      this.listPoli = [];
      this.listPoliTemp = []
    })

    let cacheOnlineBPJS = this.cacheHelper.get('cacheOnlineBPJS')
    if (cacheOnlineBPJS != undefined) {
      this.formGroup.get('noRujukan').setValue(cacheOnlineBPJS.nobpjs)
      this.noReservasi = cacheOnlineBPJS.noreservasi
      this.cacheHelper.set('cacheOnlineBPJS', undefined)
    }

  }
  goBack() {
    window.history.back()
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  //  getPegawaiByName(event) {
  //   this.httpService.get('master/pegawai/get-pegawai-by-nama/' + event.query).subscribe(data => {
  //     this.listPegawai = data.data;
  //   });
  // }

  // getNoRujukan() {
  //   if (this.formGroup.get('noRujukan').value == '') return;
  //   if (this.formGroup.get('pCare').value == '' && this.formGroup.get('rumahSakit').value == '') {
  //     this.alertService.warn('Peringatan', 'Jenis Faskes Belum di pilih')
  //     return;
  //   }

  //   let nomor = this.formGroup.get('noRujukan').value
  //   if (this.isTemporaryBrigding == 'true') {
  //     this.getNoKaTemporaryBrigding()
  //   } else {
  //     if (nomor.toString().length <= 14) {
  //       this.cekPesertaByNoKartu(this.formGroup.get('noRujukan').value)
  //     } else {
  //       this.cekPesertaByNoRujukan(this.formGroup.get('noRujukan').value)
  //     }
  //   }

  // }
  getNoRujukan() {
    if (this.formGroup.get('noRujukan').value == '') return;
    if (this.formGroup.get('pCare').value == '' && this.formGroup.get('rumahSakit').value == '' && this.formGroup.get('pascaRanap').value == '') {
      this.alertService.warn('Peringatan', 'Jenis Faskes Belum di pilih')
      return;
    }



    let nomor = this.formGroup.get('noRujukan').value
    if (this.isTemporaryBrigding == 'true') {
      this.getNoKaTemporaryBrigding()
    } else {
      if (nomor.toString().length == 6) {
        this.getPasienByNoCM1(nomor)
      }
      else if (nomor.toString().length <= 14) {
        this.cekPesertaByNoKartu(this.formGroup.get('noRujukan').value)
      } else {
        this.cekPesertaByNoRujukan(this.formGroup.get('noRujukan').value)
      }
    }

  }

  getNoKaTemporaryBrigding() {
    this.listDokter = []
    this.httpService.get('kiosk/get-combo-dokter-temp').subscribe(sa => {
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
        if (this.formGroup.get('noRujukan').value.toString().length == 6)
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
          this.httpService.get('kiosk/get-ruanganbykode/' + element.rujukan.poliRujukan.kode).subscribe(res => {
            if (res.data != null) {
              this.formGroup.get('poliTujuan').setValue({
                'kode': res.data.kdinternal,
                'nama': res.data.namaruangan,
                'kodeinternal': res.data.id,
                'objectdepartemenfk': res.data.objectdepartemenfk,
                'iseksekutif': res.data.iseksekutif,
              })
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
          this.alertService.info('Status Peserta', element.rujukan.peserta.statusPeserta.keterangan);
          break
        }
      }
    });
  }
  getPasienByNoCM1(nocm) {
    this.httpService.get('reservasionline/get-pasien/' + nocm + '/null').subscribe(e => {
      if (e.data.length > 0) {
        this.formGroup.get('noRujukan').setValue(e.data[0].nobpjs)
        this.cekPesertaByNoKartu(this.formGroup.get('noRujukan').value)
      } else {

      }
    })
  }
  cekPesertaByNoKartu(noKa) {
    if (this.formGroup.get('pCare') == null) return
    let jenis = this.formGroup.get('pCare').value

    this.httpService.get("bridging/bpjs/get-rujukan-" + jenis + "-nokartu?nokartu=" + noKa).subscribe(e => {
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

        this.getDiagnosaByKode(this.item.diagnosa.kode)
        // get Dokter DPJP By Histori
        this.getHistoriPelayananPesesta(e.response.rujukan.peserta.noKartu)
        // end Histori
        this.isInfoPasien = true
        this.alertService.info('Status Peserta', e.response.rujukan.peserta.statusPeserta.keterangan);
      } else {
        this.isInfoPasien = false
        this.alertService.error('Error', e.metaData.message);
      }
    }, error => {
      this.isInfoPasien = false
      this.alertService.error('Error', error);
    })
  }

  cekPesertaByNoRujukan(noKa) {
    let jenis = "rs"
    if (this.formGroup.get('pCare').value != null)
      jenis = this.formGroup.get('pCare').value
    this.httpService.get('bridging/bpjs/get-rujukan-' + jenis + '?norujukan=' + noKa).subscribe(e => {
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
        // var tglLahir = new Date(e.response.rujukan.peserta.tglLahir);
        // $scope.model.tglRujukan = new Date(e.response.rujukan.tglKunjungan)
        // $scope.model.noKepesertaan = $scope.noKartu = e.response.rujukan.peserta.noKartu;
        // $scope.model.namaPeserta = e.response.rujukan.peserta.nama;
        // $scope.model.tglLahir = tglLahir;
        // $scope.model.noIdentitas = e.response.rujukan.peserta.nik;
        // $scope.model.kelasBridg = {
        //   id: parseInt(e.response.rujukan.peserta.hakKelas.kode),
        //   kdKelas: e.response.rujukan.peserta.hakKelas.kode,
        //   nmKelas: e.response.rujukan.peserta.hakKelas.keterangan,
        //   namakelas: e.response.rujukan.peserta.hakKelas.keterangan,
        // };
        // if ($scope.model.kelasBridg.id == 1) {
        //   $scope.model.kelasDitanggung = { id: 3, namakelas: 'Kelas I' }
        // } else if ($scope.model.kelasBridg.id == 2) {
        //   $scope.model.kelasDitanggung = { id: 2, namakelas: 'Kelas II' }
        // } else {
        //   $scope.model.kelasDitanggung = { id: 1, namakelas: 'Kelas III' }
        // }

        // $scope.kodeProvider = e.response.rujukan.provPerujuk.kode;
        // $scope.namaProvider = e.response.rujukan.provPerujuk.nama;
        // $scope.model.namaAsalRujukan = $scope.kodeProvider + " - " + $scope.namaProvider;
        // $scope.model.jenisPeserta = e.response.rujukan.peserta.jenisPeserta.keterangan;
        // this.httpService.get("registrasipasien/get-diagnosa-saeutik?kddiagnosa=" + e.response.rujukan.diagnosa.kode)
        //   .subscribe(res => {
        //     $scope.sourceDiagnosa.add(res[0])
        //     $scope.model.diagnosa = res[0]
        //   })

        // get Dokter DPJP By Histori
        this.getHistoriPelayananPesesta(e.response.rujukan.peserta.noKartu)
        // end Histori


        this.alertService.info('Status Peserta', e.response.rujukan.peserta.statusPeserta.keterangan);
      } else {
        this.isInfoPasien = false
        this.alertService.error('Error', e.metaData.message);
      }

    }, error => {
      this.isInfoPasien = false
      this.alertService.error('Error', error);
    })
  }
  getDiagnosaByKode(kode) {
    this.httpService.get('kiosk/get-diagnosabykode/' + kode).subscribe(res => {
      this.item.diagnosa.id = res.data.id
      // this.diagnosa = res.data
    })
  }
  getRuanganInternal(kode: any) {
    this.httpService.get('kiosk/get-ruanganbykode/' + kode).subscribe(res => {
      if (res.data != null) {
        this.formGroup.get('poliTujuan').setValue({
          'kode': res.data.kdinternal,
          'nama': res.data.namaruangan,
          'kodeinternal': res.data.id,
          'objectdepartemenfk': res.data.objectdepartemenfk,
          'iseksekutif': res.data.iseksekutif,
        })

        this.httpService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 2
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

            } else {
              this.listDokter = []
              this.alertService.info('Dokter DPJP tidak ada', 'Info')
            }

          });
        this.pasienDaftar.idruangan = res.data.id
        this.pasienDaftar.objectdepartemenfk = res.data.objectdepartemenfk
      }

    })
  }
  getPasienByNoCM(nocm) {
    this.httpService.get('reservasionline/get-pasien/' + nocm + '/null').subscribe(e => {
      if (e.data.length > 0) {
        this.pasien = e.data[0]

      } else {

      }
    })
  }
  getHistoriPelayananPesesta(noKartu) {
    // debugger
    let jenisPel = ''
    let kdSpesialis = ''
    this.httpService.get("bridging/bpjs/monitoring/HistoriPelayanan/NoKartu/" + noKartu).subscribe(data => {
      if (data.metaData.code == 200) {
        this.listHistori = data.response.histori;
        if (this.listHistori.length > 0) {
          jenisPel = this.listHistori[0].jnsPelayanan
          let kodeNamaPoli = this.listHistori[0].poli.split(' ');
          if (kodeNamaPoli.length > 0)
            this.httpService.get("bridging/bpjs/get-poli?kodeNamaPoli=" + kodeNamaPoli[0]).subscribe(e => {
              if (e.metaData.code == 200) {
                let resPoli = e.response.poli;
                if (resPoli.length > 0) {
                  for (let i in resPoli) {
                    if (this.listHistori[0].poli == resPoli[i].nama) {
                      kdSpesialis = resPoli[i].kode
                      break
                    }
                  }

                  this.httpService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + jenisPel
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

                      } else {
                        this.listDokter = []
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
        // this.listDokter.push({ label: '--Pilih Dokter --', value: null });
        this.listHistori = []



      }
    });
  }

  insertSep() {
    if (this.isTemporaryBrigding == 'true') {
      this.insertTempBrigding()
    } else {
      /*
      * cek kuota poli
      */
      if (this.formGroup.get('poliTujuan').value == '') {
        this.alertService.warn('Peringatan', 'Pilih Poli dahulu')
        return
      }
      // this.httpService.get('kiosk/get-slotting-kosong?ruanganfk=' + this.formGroup.get('poliTujuan').value.kodeinternal).subscribe(es => {
      //   if (es.status == true) {
      this.insertLiveBridging()
      // } else {
      // this.alertService.info('Info', es.status)
      // return
      // }
      // })
      // this.getRuanganInternal(this.formGroup.get('poliTujuan').value.kode)
      // this.insertLiveBridging()
    }
  }
  insertLiveBridging() {
    let asalRujukan = "2"
    if (this.formGroup.get('pCare').value != null) {
      if (this.formGroup.get('pCare').value == 'pcare') {
        asalRujukan = "1"
      } else {
        asalRujukan = "2"
      }
    }

    let poliTujuan = ""
    if (this.formGroup.get('poliTujuan').value != '')
      poliTujuan = this.formGroup.get('poliTujuan').value.kode

    let eksekutif = "0"
    this.eksekutif = 1
    if (this.formGroup.get('poliTujuan').value != ''
      && this.formGroup.get('poliTujuan').value.iseksekutif != undefined
      && this.formGroup.get('poliTujuan').value.iseksekutif == true) {
      eksekutif = "1"
      this.eksekutif = 2
    }
    var dataSend = {
      "data": {
        "request": {
          "t_sep": {
            "noKartu": this.item.peserta.noKartu,
            "tglSep": moment(new Date()).format('YYYY-MM-DD'),
            "ppkPelayanan": this.ppkPelayananRS,
            "jnsPelayanan": this.item.pelayanan.kode,
            "klsRawat": this.item.peserta.hakKelas.kode.toString(),
            "noMR": this.item.peserta.mr.noMR,
            "rujukan": {
              "asalRujukan": asalRujukan,//RS
              "tglRujukan": this.item.tglKunjungan,
              "noRujukan": this.item.noKunjungan,
              "ppkRujukan": this.item.provPerujuk.kode
            },
            "catatan": "",
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
              "penjamin": {
                "penjamin": "",
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
            "skdp": {
              "noSurat": this.noSKDP,
              "kodeDPJP": this.formGroup.get("dokterDPJP").value != '' ? this.formGroup.get("dokterDPJP").value.kode : ""
            },
            "noTelp": this.item.peserta.mr.noTelepon,
            "user": "Ramdanegie"
          }
        }
      }
    };
    this.httpService.post("bridging/bpjs/insert-sep-v1.1", dataSend).subscribe(e => {
      if (e.response != null) {
        this.dataSEP.nosep = e.response.sep.noSep
        this.dataSEP.tglSep = e.response.sep.tglSep

        this.alertService.success('Status', 'Generate SEP Success. No SEP : ' + e.response.sep.noSep);
        this.savePasienDatfatar();

      } else {
        this.alertService.error('Gagal Generate SEP', e.metaData.message);
      }

    }, function (err) {

    });
  }
  public getJSON(jenis): Observable<any> {
    return this.service.get<any>("assets/jsonbridging/bpjs/" + jenis + ".json")
      .pipe(
        tap((res: any) => {
          return res
        }),

      )
  };
  // }
  //   public getJSON(jenis): Observable<any> {
  //     return this.service.get("assets/jsonbridging/bpjs/" + jenis + ".json")
  //       .map(response => response.json())
  //       .catch(e => { console.log(e); return Observable.throw(e); })

  // }

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
          this.httpService.get('bridging/bpjs/generate-sep-dummy?kodeppk=' + this.ppkPelayananRS).subscribe(es => {
            this.dataSEP.nosep = es
            // this.dataSEP.nosep = element.sep.noSep
            this.dataSEP.tglSep = moment(new Date()).format('YYYY-MM-DD')
            this.alertService.success('Status', 'Generate SEP Success. No SEP : ' + this.dataSEP.nosep);
            this.showCetak = true
            this.savePasienDatfatar();

          })
          break
        }
      }
    });
  }
  savePasienDatfatar() {
    this.kodeDokter = null
    this.httpService.get('kiosk/get-dokter-internal?kode=' +
      this.formGroup.get("dokterDPJP").value.kode).subscribe(e => {
        if (e != false) {
          this.kodeDokter = e.id
        }
        if (this.pasien.nocmfk == undefined) {
          this.isStatusPasien = 'BARU'
          this.savePasien()
        } else {
          this.isStatusPasien = 'LAMA'
          this.savePasienDaftarFix()
        }
      })
  }
  lanjutSave() {

  }
  savePasienDaftarFix() {
    if (this.eksekutif == '0') {

    }
    var pasiendaftar = {
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'tglregistrasidate': moment(new Date()).format('YYYY-MM-DD'),
      'nocmfk': this.pasien.nocmfk,
      'objectruanganfk': this.formGroup.get('poliTujuan').value.kodeinternal, //this.pasienDaftar.idruangan,
      'objectdepartemenfk': this.formGroup.get('poliTujuan').value.objectdepartemenfk, //this.pasienDaftar.objectdepartemenfk,
      'objectkelasfk': 6,//nonkelas
      'objectkelompokpasienlastfk': 2,//umum
      'objectrekananfk': 2552,
      'tipelayanan': this.eksekutif != undefined ? this.eksekutif : 1,//reguler
      'objectpegawaifk': this.kodeDokter,
      'noregistrasi': '',
      'norec_pd': '',
      'israwatinap': 'false',
      'statusschedule': this.noReservasi != undefined ? this.noReservasi : 'Kios-K',
      'statuspasien': this.isStatusPasien,
    }
    var antrianpasiendiperiksa = {
      'norec_apd': '',
      'tglregistrasi': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      'objectruanganfk': this.formGroup.get('poliTujuan').value.kodeinternal, //this.pasienDaftar.idruangan,
      'objectkelasfk': 6,//nonkelas
      'objectpegawaifk': this.kodeDokter,
      'objectkamarfk': null,
      'nobed': null,
      'objectdepartemenfk': this.formGroup.get('poliTujuan').value.objectdepartemenfk, //this.pasienDaftar.objectdepartemenfk,
      'objectasalrujukanfk': 2,//Datang Sendiri
      'israwatgabung': 0,
    }
    var objSave = {
      'pasiendaftar': pasiendaftar,
      'antrianpasiendiperiksa': antrianpasiendiperiksa
    }

    this.httpService.post('registrasi/save-registrasipasien', objSave).subscribe(response => {
      this.pasienDaftar.noregistrasi = response.dataPD.noregistrasi
      this.pasienDaftar.norec_pd = response.dataPD.norec
      this.pasienDaftar.tglregistrasi = response.dataPD.tglregistrasi
      this.pasienDaftar.norec_apd = response.dataAPD.norec


      this.saveLogging('Pendaftaran Pasien', 'norec Pasien Daftar', response.dataPD.norec,
        'Self Registration No Registrasi (' + response.dataPD.noregistrasi + ') ')
      this.simpanPemakaianAsuransi()
      this.updateStatusConfirm()
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
    this.httpService.post("registrasi/save-adminsitrasi", json).subscribe(z => {

    })
  }
  updateStatusConfirm() {
    let data = {
      "noreservasi": this.noReservasi,
    }
    this.httpService.post('reservasionline/update-data-status-reservasi', data).subscribe(e => {

    })
  }
  savePasien() {
    var postJson = {
      'isbayi': false,
      'isPenunjang': false,
      'idpasien': '',
      'pasien': {
        'namaPasien': this.item.peserta.nama,
        'noIdentitas': this.item.peserta.nik,
        'namaSuamiIstri': null,
        'noAsuransiLain': null,
        'noBpjs': this.item.peserta.noKartu,
        'noHp': this.item.peserta.mr.noTelepon,
        'tempatLahir': '',
        'namaKeluarga': null,
        'tglLahir': this.item.peserta.tglLahir
      },
      'agama': {
        'id': null,
      },
      'jenisKelamin': {
        'id': this.item.peserta.sex == 'L' ? 1 : 2,
      },
      'pekerjaan': {
        'id': null,
      },
      'pendidikan': {
        'id': null,
      },
      'statusPerkawinan': {
        'id': 0,
      },
      'namaIbu': null,
      'noTelepon': this.item.peserta.mr.noTelepon,
      'noAditional': null,
      'kebangsaan': {
        'id': 1,//WNI
      },
      'negara': {
        'id': 0,
      },
      'namaAyah': null,
      'alamatLengkap': '-',
      'desaKelurahan': {
        'id': null,
        'namaDesaKelurahan': null,
      },
      'kecamatan': {
        'id': null,
        'namaKecamatan': null,
      },
      'kotaKabupaten': {
        'id': null,
        'namaKotaKabupaten': null,
      },
      'propinsi': {
        'id': null,
      },
      'kodePos': null,
    }
    this.httpService.post('registrasi/save-pasien-fix', postJson)
      .subscribe(
        res => {
          let tempId = res.data.id;
          this.pasien.nocmfk = res.data.kodeexternal
          this.pasien.nocm = res.data.nocm
          this.pasien.objectjeniskelaminfk = res.data.objectjeniskelaminfk

          this.savePasienDaftarFix()
        }, error => {

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
      'kdinstitusiasal': 2552,
      'kdpenjaminpasien': 2552,
      'objectkelasdijaminfk': kelas,
      'namapeserta': this.item.peserta.nama,
      'nikinstitusiasal': 2552,
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
      'nosuratskdp': "",
      'kodedpjp': this.formGroup.get('dokterDPJP').value.kode,
      'namadpjp': this.formGroup.get('dokterDPJP').value.nama,
      'prolanisprb': null,
      'asalrujukanfk': asalrujukan
    }
    var objSave = {
      'asuransipasien': asuransipasien,
      'pemakaianasuransi': pemakaianasuransi
    }
    this.httpService.post('registrasi/save-asuransipasien', objSave).subscribe(e => {
      this.showCetak = true
      this.isSuksesSEP = true
    })
  }
  cetakSep() {
    this.service.get("http://127.0.0.1:3885/desk/routes?cetak-sep=1&noregistrasi=" +
      this.pasienDaftar.noregistrasi + "&qty=1&idpegawai=&ket=&view=true").subscribe(e => {
      });
    // this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + this.pasienDaftar.noregistrasi + '&view=false').subscribe(e => {
    //   // do something with response
    // });
  }
  cetakAntrian() {
    let petugas = '-'
    this.service.get("http://127.0.0.1:3885/desk/routes?cetak-buktipendaftaran=1&noregistrasi=" +
    this.pasienDaftar.noregistrasi + "&qty=1&idpegawai=&ket=&view=true").subscribe(e => {
    });
    // this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec='
    //   + this.pasienDaftar.noregistrasi + '&petugas=' + petugas + '&view=false').subscribe(response => {
    //     // do something with response
    //   });
  }

  changePoli(event) {
    this.httpService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 2
      + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + event.value.kode).subscribe(data => {
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
        }
        else {
          this.listDokter = [];
          this.alertService.info('Info', 'Dokter DPJP tidak ada')
        }

      });
  }
  changeClick() {
    this.listDokTemp = this.listDokter
    if (this.formGroup.get('allDPJP').value == true) {
      this.httpService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=" + 1
        + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=").subscribe(data => {
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
          }
          else
            this.alertService.info('Info', 'Dokter DPJP tidak ada')
        });
    } else {
      this.listDokter = this.listDokTemp
    }
  }


  //jQUERY

}
