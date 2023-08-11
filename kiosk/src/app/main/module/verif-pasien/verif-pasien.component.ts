
import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { HttpService } from '../httpService';

@Component({
  selector: 'app-verif-pasien',
  templateUrl: './verif-pasien.component.html',
  styleUrls: ['./verif-pasien.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerifPasienComponent implements OnInit {
  contentHeader:any
  
  url: any
  sub: any;
  formGroup: FormGroup;
  isInfoPasien: boolean = false

  noCm: any;
  namaPasien: any;
  jenisKelamin: any;
  noIdentitas: any;
  tempatTglLahir: any;
  statusKawin: any
  alamat: any;
  noTelpon: any;
  idPasien: any;
  dataCache: any
  isInfoPasienBaru: boolean
  listDataAgama: any = []
  listDataPendidikan: any = []
  listDataPekerjaan: any = []
  listDataJenisKelamin: any = []
  listJenisKelamin: any = []
  listStatusKawin: any = []
  listDataStatusPerkawinan: any = []
  listGolonganDarah: any = []
  listPendidikan: any = []
  listPekerjaan: any = []
  listHambatan: any = []
  item: any = {}
  loading: boolean
  constructor( private router: Router,
    private route: ActivatedRoute,
    private httpservice: HttpService,
    private fb: FormBuilder,
    private cacheHelper: CacheService,
    private alertService: ToastrService) { }

  ngOnInit(): void {
    this.httpservice.get("medifirst2000/registrasi/get-combo-registrasi").subscribe(se => {
      this.listDataJenisKelamin = se.jeniskelamin
      this.listDataPekerjaan = se.pekerjaan
      this.listDataAgama.push({label: '- Pilih Agama -', value: null})
      se.agama.forEach(response => {
        this.listDataAgama.push({label: response.agama, value: {
            'id': response.id,
            'agama': response.agama,
          }
        }) 
      })
      se.golongandarah.forEach(response => {
        this.listGolonganDarah.push({
          label: response.golongandarah, value: {
            'id': response.id,
            'golongandarah': response.golongandarah,
          }
        }) 
      })
      se.jeniskelamin.forEach(response => {
        this.listJenisKelamin.push({
          label: response.jeniskelamin, value: {
            'id': response.id,
            'jeniskelamin': response.jeniskelamin,
          }
        }) 
      })
      se.statusperkawinan.forEach(response => {
        this.listStatusKawin.push({
          label: response.statusperkawinan, value: {
            'id': response.id,
            'statusperkawinan': response.statusperkawinan,
          }
        }) 
      })
      se.pendidikan.forEach(response => {
        this.listPendidikan.push({
          label: response.pendidikan, value: {
            'id': response.id,
            'pendidikan': response.pendidikan,
          }
        }) 
      })
      se.hambatan.forEach(response => {
        this.listHambatan.push({
          label: response.hambatankomunikasi, value: {
            'id': response.id,
            'hambatankomunikasi': response.hambatankomunikasi,
          }
        }) 
      })
      se.pekerjaan.forEach(response => {
        this.listPekerjaan.push({
          label: response.pekerjaan, value: {
            'id': response.id,
            'pekerjaan': response.pekerjaan,
          }
        }) 
      })
      this.listDataPendidikan = se.pendidikan
      this.listDataStatusPerkawinan = se.statusperkawinan

    })
    this.cacheHelper.set('cacheSelfRegis', undefined);
    this.formGroup = this.fb.group({
      'noCm': new FormControl(''),
      'baru': new FormControl(''),
      'lama': new FormControl(''),
      'jenisPasien': new FormControl(''),
      'tempatLahir': new FormControl(''),
      'idAgama': new FormControl(null),
      'namaPasien': new FormControl(''),
      'noHp': new FormControl(''),
      'alamat': new FormControl(''),
      'idJenisKelamin': new FormControl(null),
      'tanggalLahir': new FormControl(null),
      'idStatusPerkawinan': new FormControl(null),
      'idGolonganDarah': new FormControl(null),
      'idpendidikan': new FormControl(null),
      'idpekerjaan': new FormControl(null),
      'idhambatan': new FormControl(null),
    })
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.url = params['page'];
        this.contentHeader = {
          headerTitle: 'Self Registration - Pasien '+ this.url ,
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
      });
    
  }
  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  getPasienByNoCM() {
    if (this.formGroup.get('jenisPasien').value == '') {
      this.alertService.warning('', 'Jenis Pasien Belum di pilih', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });

      // this.alertService.warning('Peringatan', 'Jenis Pasien Belum di pilih')
      return;
    }

    if (this.formGroup.get('jenisPasien').value == 'lama') {
      this.loading = true
      this.httpservice.get('medifirst2000/reservasionline/get-pasien/' + this.formGroup.get('noCm').value + '/null').subscribe(e => {
        if (e.data.length > 0) {

          let result = e.data[0]
          if (result.tgllahir == null)
            result.tgllahir = '-'
          if (result.tempatlahir == null)
            result.tempatlahir = '-'
          if (result.alamatlengkap == null)
            result.alamatlengkap = '-'
          if (result.notelepon == null || result.notelepon == "")
            result.notelepon = '-'
          if (result.noidentitas == null || result.noidentitas == "")
            result.noidentitas = '-'
          this.isInfoPasien = true
          this.noCm = result.nocm
          this.namaPasien = result.namapasien
          this.jenisKelamin = result.jeniskelamin
          this.noIdentitas = result.noidentitas
          this.tempatTglLahir = result.tempatlahir + ', ' + result.tgllahir
          this.alamat = result.alamatlengkap
          this.noTelpon = result.notelepon
          this.idPasien = result.nocmfk
          this.dataCache = result
        } else {
          this.isInfoPasien = false
          this.dataCache = undefined
          this.alertService.error('', 'Data tidak ditemukan', {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
            positionClass: 'toast-bottom-center'
          });
          // this.alertService.error('Info', 'Data tidak ditemukan')
        }
        this.loading = false
      }, error => {
        this.isInfoPasien = false
        this.loading = false
        this.alertService.error('', 'Data tidak ditemukan', {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
        // this.alertService.error('Info', 'Data tidak ditemukan')
      })
    } else {
      let nik = this.formGroup.get('noCm').value
      if (nik != null && nik.length > 10) {
        this.loading = true
        this.isInfoPasienBaru = true
        this.noIdentitas = nik

      }else{
        this.alertService.error('', 'Data tidak ditemukan', {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
      }
    }

  }
  pilihPoli(data) {
    console.log(this.formGroup.get('tanggalLahir'));
    
    if(data == 'baru'){
      var postJson = {
              'isbayi': false,
              'istriageigd': false,
              'isPenunjang': false,
              'idpasien': '',
              'pasien': {
                'namaPasien': this.formGroup.get('namaPasien').value,
                'noIdentitas': this.noIdentitas != undefined ? this.noIdentitas : null,
                'namaSuamiIstri': null,
                'noAsuransiLain': null,
                'noBpjs': null,
                'noHp': this.formGroup.get('noHp').value,
                'tempatLahir': this.formGroup.get('tempatLahir').value,
                'namaKeluarga': null,
                'tglLahir': moment(this.formGroup.get('tanggalLahir').value.year + '-' +this.formGroup.get('tanggalLahir').value.month +'-'+ this.formGroup.get('tanggalLahir').value.day).format('YYYY-MM-DD HH:mm'),
                'image': null
              },
              'agama': {
                'id': this.formGroup.get('idAgama').value.value.id,
              },
              'jenisKelamin': {
                'id': this.formGroup.get('idJenisKelamin').value.value.id,
              },
              'pekerjaan': {
                'id': this.formGroup.get('idpekerjaan').value.value.id,
              },
              'pendidikan': {
                'id': this.formGroup.get('idpendidikan').value.value.id,
              },
              'statusPerkawinan': {
                'id': this.formGroup.get('idStatusPerkawinan').value.value.id,
              },
              'golonganDarah': {
                'id': this.formGroup.get('idGolonganDarah').value.value.id,
              },
              'suku': {
                'id': null,
              },
              'hambatan': {
                'id': this.formGroup.get('idhambatan').value.value.id,
              },
              'namaIbu': null,
              'noTelepon': null,
              'noAditional': null,
              'kebangsaan': {
                'id': 1,
              },
              'negara': {
                'id': 0,
              },
              'namaAyah': null,
              'alamatLengkap': this.formGroup.get('alamat').value,
              'desaKelurahan': {
                'id': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.id : null,
                'namaDesaKelurahan': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.namadesakelurahan : null,
              },
              'kecamatan': {
                'id': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.objectkecamatanfk : null,
                'namaKecamatan': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.namakecamatan : null,
              },

              'kotaKabupaten': {
                'id': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.objectkotakabupatenfk : null,
                'namaKotaKabupaten': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.namakotakabupaten : null,
              },
              'propinsi': {
                'id': this.item.desaKelurahan != undefined ? this.item.desaKelurahan.objectpropinsifk : null,
              },
              'kodePos': null,
              'penanggungjawab': null,
              'hubungankeluargapj': null,
              'pekerjaanpenangggungjawab': null,
              'ktppenanggungjawab': null,
              'alamatrmh': null,
              'alamatktr': null,
              'teleponpenanggungjawab': null,
              'bahasa': null,
              'jeniskelaminpenanggungjawab': null,
              'umurpenanggungjawab': null,
              'dokterpengirim': null,
              'alamatdokter': null
            }
            this.dataCache = postJson
            console.log(postJson);
            
      var cache = {
        0: this.dataCache,
        1: 'Umum',
      }
      this.cacheHelper.set('cacheSelfRegis', cache);
      this.router.navigate(['touchscreen/self-regis/verif-pasien/poli'], { queryParams: { nocmfk: this.idPasien, tipepasien: this.url } })
    }else{
      var cache = {
        0: this.dataCache,
        1: 'Umum',
      }
      this.cacheHelper.set('cacheSelfRegis', cache);
      this.router.navigate(['touchscreen/self-regis/verif-pasien/poli'], { queryParams: { nocmfk: this.idPasien, tipepasien: this.url } })
    }
  }
}
