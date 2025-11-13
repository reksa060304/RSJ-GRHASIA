import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, Renderer2 } from '@angular/core';
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
declare const grecaptcha: any;
@Component({
  selector: 'app-verif-pasien-bpjs-old',
  templateUrl: './verif-pasien-bpjs-v2.component.html',
  styleUrls: ['./verif-pasien-bpjs-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerifPasienBpjsV2Component implements OnInit {
  contentHeader: any
  url: any
  sub: any;
  loading: boolean
  pasien: any = {}
  dataCache: any
  item: any = {
    // peserta: {
    //   jenisPeserta: {},
    //   umur: {},
    //   mr: {}
    // },
    // diagnosa: {},
    // provPerujuk: {},
    // poliRujukan: {}
  }
  datCacheOnlineBPJS: any ={}
  isCetakDSKiosk: any = 'true'
  showCetak: boolean = false
  ppkPelayananRS: any = "0240R008"
  isTemporaryBrigding: string
  isAdminOtomatisKiosk: any
  dataSEP: any = {}
  tujuanKunj: any = "0";
  flagprocedure : any = "";
  assesmentPel: any = "";
  showPasca: boolean = false;
  
  constructor(private router: Router,
    // private route: ActivatedRoute,
    private httpService: HttpService,
    // private fb: FormBuilder,
    private cacheHelper: CacheService,
    private service: HttpClient,
    // private alertService: ToastrService,
    private msgService: AlertService,
    // private modalService: NgbModal,
    private renderer: Renderer2
  ) {
    let sett = localStorage.getItem('isCetakDS')
    if (sett != null) {
      this.isCetakDSKiosk = sett
    }
  }
  ngOnInit(): void {
    this.ngAfterViewInit()
    this.contentHeader = {
      headerTitle: 'Check In - Pasien BPJS',
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
    // this.httpService.get('medifirst2000/bridging/bpjs/generateskdp').subscribe(resp => {
    //   this.noSKDP = resp.noskdp

    // })



    this.cacheHelper.set('cacheSelfRegis', undefined);

    this.datCacheOnlineBPJS = this.cacheHelper.get('cacheOnlineBPJS')
    console.log(this.datCacheOnlineBPJS)

    

    if (this.datCacheOnlineBPJS != undefined) {
      this.item = this.datCacheOnlineBPJS
      if (this.item.diagnosa != null) {
        var diagnosa = this.item.diagnosa.split(' - ');
          this.item.diagnosakode = diagnosa[0];
      } 
      if (this.item.jnspelsepasal == 'Rawat Inap') {
        this.showPasca = true;
        if (this.item.norujukan != null) {
          if (this.item.norujukan.length < 14) {
            this.item.norujukan = this.item.nosepasalkontrol
          }
        }
      }
    
    } else {
      window.history.back()
      return
    }

    if (this.item.nosuratkontrol == null || this.item.norujukan == null) {
     let cekNoRef = this.item.noreferensi.charAt(12)
     if (cekNoRef == 'K') {
        // get ke bridging cari surkon
        let json = {
          url: `RencanaKontrol/noSuratKontrol/${this.item.noreferensi}`,
          method: "GET",
          data: null as any
      };
      
      this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", json).subscribe(e => {
        if (e.metaData.code == 200) {
          let surkon = e.response
          this.item.tglrujukan = surkon.sep.provPerujuk.tglRujukan 
          this.item.kdprovperujuk = surkon.sep.provPerujuk.kdProviderPerujuk 
          this.item.namaprovperujuk = surkon.sep.provPerujuk.nmProviderPerujuk 
          this.item.diagnosa = surkon.sep.diagnosa 
          if (this.item.diagnosa != null) {
            var diagnosa = this.item.diagnosa.split(' - ');
              this.item.diagnosakode = diagnosa[0];
          } 
          this.item.nosuratkontrol = surkon.noSuratKontrol 
          this.item.kddokterskdp = surkon.kodeDokter 
          this.item.norujukan = surkon.sep.provPerujuk.noRujukan
         
          this.item.asalrujukan = surkon.sep.provPerujuk.asalRujukan
          this.item.jnspelsepasal = surkon.sep.jnsPelayanan
          if (this.item.jnspelsepasal == 'Rawat Inap') {
            this.showPasca = true;
            if (this.item.norujukan.length < 16) {
              this.item.norujukan = surkon.sep.noSep
            }
          }
          this.item.tglrencanakontrol = surkon.tglRencanaKontrol
          this.item.namadokterskdp = surkon.namaDokter
        }
         
      }, error => {
          
      });
      
     } else {
      if (this.item.objectasalrujukanfk == 4) {
        let jsonrujukan = {
          url: `Rujukan/RS/${this.item.noreferensi}`,
          method: "GET",
          data: null as any
        };
      
        this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", jsonrujukan).subscribe(e => {
          if (e.metaData.code == 200) {
            let rujukan = e.response
            this.item.tglrujukan = rujukan.rujukan.tglKunjungan
            this.item.kdprovperujuk =rujukan.rujukan.provPerujuk.kode 
            this.item.namaprovperujuk = rujukan.rujukan.provPerujuk.nama 
            this.item.diagnosa = rujukan.rujukan.diagnosa.kode + ' - ' + rujukan.rujukan.diagnosa.nama
            if (this.item.diagnosa != null) {
              var diagnosa = this.item.diagnosa.split(' - ');
                this.item.diagnosakode = diagnosa[0];
            } 
            this.item.norujukan = rujukan.rujukan.noKunjungan
            this.item.asalrujukan = "2"
          }
        }, error => {
            
        });
      } else {
        let jsonrujukan = {
          url: `Rujukan/${this.item.noreferensi}`,
          method: "GET",
          data: null as any
        };
      
        this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", jsonrujukan).subscribe(e => {
          if (e.metaData.code == 200) {
            let rujukan = e.response
            this.item.tglrujukan = rujukan.rujukan.tglKunjungan
            this.item.kdprovperujuk =rujukan.rujukan.provPerujuk.kode 
            this.item.namaprovperujuk = rujukan.rujukan.provPerujuk.nama 
            this.item.diagnosa = rujukan.rujukan.diagnosa.kode + ' - ' + rujukan.rujukan.diagnosa.nama
            if (this.item.diagnosa != null) {
              var diagnosa = this.item.diagnosa.split(' - ');
                this.item.diagnosakode = diagnosa[0];
            } 
            this.item.norujukan = rujukan.rujukan.noKunjungan
            this.item.asalrujukan = "1"
          }
        }, error => {
            
        });
      }
     }
    }

    // window.location.href = 'frista://open';
    window.location.href = `frista://open?username=User27@0135R004&password=Johnab23@&nobpjs=${this.item.nobpjs}`;
    
   

  }

  insertSep() {

    var noskdp = "";
    if (this.item.nosuratkontrol != null) {
      noskdp = this.item.nosuratkontrol
    }

    var kddokterskdp = "";
    if (this.item.kddokterskdp != null) {
      kddokterskdp = this.item.kddokterskdp
    }

    

    var kddiagnosa = "";
    if (this.item.diagnosa != null) {
      var diagnosa = this.item.diagnosa.split(' - ');
        kddiagnosa = diagnosa[0];
    }

    this.getDiagnosaByKode(kddiagnosa)

   
    if (this.item.jnspelsepasal == 'Rawat Jalan') {
      this.tujuanKunj = "2";
      this.assesmentPel = "5";
    } else if (this.item.jnspelsepasal == 'Rawat Inap') {
      this.tujuanKunj = "0";
      this.assesmentPel = "";
    } else {
      this.tujuanKunj = "0";
      this.assesmentPel = "";
    }
    
    var dataSend = {
      "url": "SEP/2.0/insert",
      "method": "POST",
      "data": {
        "request": {
          "t_sep": {
            "noKartu": this.item.nobpjs,
            "tglSep": moment(new Date()).format('YYYY-MM-DD'),
            "ppkPelayanan": this.ppkPelayananRS,
            "jnsPelayanan": "2",
            "klsRawat": {
              "klsRawatHak": "2",
              "klsRawatNaik": "",
              "pembiayaan": "",
              "penanggungJawab": ""
            },
            "noMR": this.item.nocm,
            "rujukan": {
              "asalRujukan": this.item.asalrujukan,//RS
              "tglRujukan": this.item.tglrujukan,
              "noRujukan": this.item.norujukan,
              "ppkRujukan": this.item.kdprovperujuk
            },
            "catatan": "CHECK IN JKN",
            "diagAwal": kddiagnosa,
            "poli": {
              "tujuan": this.item.noruangan,
              "eksekutif": 0
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
            "tujuanKunj": this.tujuanKunj ,
            "flagProcedure": this.flagprocedure ,
            "kdPenunjang":"" ,
            "assesmentPel": this.assesmentPel,
            "skdp": {
              "noSurat": noskdp,
              "kodeDPJP": kddokterskdp
            },
            "dpjpLayan": this.item.kddokterbpjs.toString(),
            "noTelp": this.item.notelepon,
            "user": "Xoxo"
          }
        }
      }
    }
   
    this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", dataSend).subscribe(e => {
      // this.httpService.post("medifirst2000/bridging/bpjs/insert-sep-v1.1", dataSend).subscribe(e => {
      if (e.response != null) {
        this.dataSEP.nosep = e.response.sep.noSep
        this.dataSEP.tglSep = e.response.sep.tglSep

        this.msgService.success('Status', 'Generate SEP Success. No SEP : ' + e.response.sep.noSep);
        let jsonParam = {
          "kodebooking": this.item.noreservasi//"D"
        }
        this.httpService.post('medifirst2000/jkn/save-checkin', jsonParam).subscribe(response => {
          // this.item.tglregistrasi = response.tglregistrasi
        })
        this.simpanPemakaianAsuransi();
      } else {
        this.msgService.error('Gagal Generate SEP', e.metaData.message);
        // this.router.navigate(['/touchscreen/checkin-v2'] )
        console.log(dataSend)
  
      }

    }, err => {
      this.msgService.error('Gagal Generate SEP', JSON.stringify(err));
      // this.router.navigate(['/touchscreen/checkin-v2'] )
    });
  }

  getDiagnosaByKode(kode) {
    this.httpService.get('medifirst2000/kiosk/get-diagnosabykode/' + kode).subscribe(res => {
      if (res.data != null) {
        this.item.diagnosa_id = res.data.id
      } else {
        this.item.diagnosa_id =null
      }
     
      // this.diagnosa = res.data
    })
  }

  simpanPemakaianAsuransi() {


    let asuransipasien = {
      'id_ap': '',
      'noregistrasi': this.item.noregistrasi,
      'nocm': this.item.nocm,
      'alamatlengkap': this.item.alamatlengkap,
      'objecthubunganpesertafk': 1,//Peserta
      'objectjeniskelaminfk': this.item.jk_id,
      'kdinstitusiasal': Configuration.profile().kdRekananBPJS,
      'kdpenjaminpasien': Configuration.profile().kdRekananBPJS,
      'objectkelasdijaminfk': this.item.hakkelasfk,
      'namapeserta': this.item.namapasien,
      'nikinstitusiasal': Configuration.profile().kdRekananBPJS,
      'noasuransi': this.item.nobpjs,
      'alamat': '',
      'nocmfkpasien': this.item.nocmfk,
      'noidentitas': this.item.noidentitas,
      'qasuransi': Configuration.profile().kdKelompokBPJS,
      'kelompokpasien': Configuration.profile().kdKelompokBPJS,
      'tgllahir': moment(new Date(this.item.tgllahir)).format('YYYY-MM-DD'),
      'jenispeserta': this.item.jenispeserta,
      'kdprovider': this.item.kdprovperujuk,
      'nmprovider': this.item.namaprovperujuk,
      'notelpmobile': this.item.notelepon,
    }

    if (this.tujuanKunj == 0) {
      this.item.statuskunjungan = 1
    }
    if (this.tujuanKunj == 1) {
      this.item.statuskunjungan = 2
    }
    if (this.tujuanKunj == 2) {
      this.item.statuskunjungan = 3
    }
    let pemakaianasuransi = {
      'norec_pa': '',
      'noregistrasifk': this.item.norec_pd,
      'tglregistrasi': moment(new Date(this.item.tglregistrasi)).format('YYYY-MM-DD HH:mm'),
      'diagnosisfk': this.item.diagnosa_id != null ? this.item.diagnosa_id : null,
      'lakalantas': 0,
      'nokepesertaan': this.item.nobpjs,
      'norujukan': this.item.norujukan,
      'nosep': this.dataSEP.nosep,
      'tglrujukan': this.item.tglrujukan,
      'objectdiagnosafk': this.item.diagnosa_id != null ? this.item.diagnosa_id : null,
      // 'tanggalsep': this.dataSEP.tglSep,
      'tanggalsep': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
      'nosuratskdp': this.item.nosuratkontrol != null ? this.item.nosuratkontrol : "",
      'kodedpjp': this.item.kddokterskdp != null ? this.item.kddokterskdp != null : null,
      'namadpjp': this.item.namadokterskdp != null ? this.item.namadokterskdp : null,
      'prolanisprb': null,
      'asalrujukanfk': this.item.asalrujukan,
      'kodedpjpmelayani': this.item.kddokterbpjs,
      'namadjpjpmelayanni': this.item.dokter ,
      'polirujukankode': this.item.noruangan,
      'polirujukannama': this.item.namaruangan,
      'klsrawatnaik': null,
      'pembiayaan': null,
      'penanggungjawab': null,
      'tujuankunj': this.tujuanKunj,
      'flagprocedure': this.flagprocedure != "" ? this.flagprocedure : null,
      'kdpenunjang': null,
      'assesmentpel': this.assesmentPel != "" ? this.assesmentPel : null,
      'statuskunjungan': this.item.statuskunjungan,
      'poliasalkode':  null,
      'politujuankode': null,
    }


    var objSave = {
      'asuransipasien': asuransipasien,
      'pemakaianasuransi': pemakaianasuransi
    }
    this.httpService.postNonMessage('medifirst2000/registrasi/save-asuransipasien', objSave).subscribe(e => {
      this.showCetak = true
      this.saveLogging('Pendaftaran Pasien', 'norec Pasien Daftar', this.item.norec_pd,
        'Check In No Registrasi (' + this.item.noregistrasi + ') ')
      // this.cetakSep()
      this.cetakAntrian()
      // this.router.navigate(['touchscreen']);
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

  cetakAntrian() {
    let petugas = '-'

    if (localStorage.getItem('isCetakDS') == 'true') {
      this.service.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec='
        + this.item.noregistrasi + '&petugas=' + petugas + '&view=false').subscribe(response => { });
        this.router.navigate(['/touchscreen/checkin-v2'] )
    } else if (localStorage.getItem('isCetakDS') == 'android') {
      // this.httpService.get("medifirst2000/report/get-cetak-bukti-pendaftaran?noregistrasi="
      //   + this.item.noregistrasi
      // ).subscribe(e => {
      //   window.open(
      //     'https://apps.transmedic.co.id/cetak-antrian?isBukti=true'
      //     + '&namaProfile=' + Configuration.profile().nama
      //     + '&alamat=' + Configuration.profile().alamat
      //     + '&noregistrasi=' + e.noregistrasi
      //     + '&norm=' + e.norm
      //     + '&namapasien=' + e.namapasien
      //     + '&kelompokpasien=' + e.kelompokpasien
      //     + '&noantrian=' + e.noantrian
      //     + '&statuspasien=' + e.statuspasien
      //     + '&tanggalreservasi=' + e.tanggalreservasi
      //     + '&ruangan=' + e.ruangan
      //     + '&status=' + e.statusonline
      //     + '&namadokter=' + e.namadokter
      //     + '&tglregistrasi=' + e.tglregistrasi
      //     + '&nosep=' + e.nosep
      //     + '&link=' + Configuration.profile().link
      //   );
      // })
      window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-bukti-pendaftaran?noregistrasi='
        + this.item.noregistrasi
        + '&kdprofile=46', '_blank');
        this.router.navigate(['/touchscreen/checkin-v2'] )
    } else {
      window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-bukti-pendaftaran?noregistrasi='
        + this.item.noregistrasi
        + '&kdprofile=46', '_blank');
        this.router.navigate(['/touchscreen/checkin-v2'] )
    }
  }

  ngAfterViewInit() {
    const script = this.renderer.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=6LcXZW4pAAAAAOWNyzoQQXA3AOlP7STHCjJsdXLv';
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(document.body, script);

    // document.read
//     window.onload = () => {
//       grecaptcha.ready(() => {
//         grecaptcha.execute('6LcXZW4pAAAAAOWNyzoQQXA3AOlP7STHCjJsdXLv', { action: 'submit' })
//           .then(token => {
//             // Token handling logic
//             console.log(token);
//             this.tokenCapt = token
//           });
//       });
//     };

  }
  //jQUERY
}