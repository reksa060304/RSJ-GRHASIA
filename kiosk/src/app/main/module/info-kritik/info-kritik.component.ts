import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { HttpService } from '../httpService';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import moment from 'moment';
@Component({
  selector: 'app-info-kritik',
  templateUrl: './info-kritik.component.html',
  styleUrls: ['./info-kritik.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InfoKritikComponent implements OnInit {

  nomorEMR: any = '-'
  namaEMR: any = 1
  listData: any = {}
  item: any = {
    obj: [],
    obj2: [],
    deskripsi: '',
    tgl: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
  }
  kom: any = {
    tgl: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
  }
  cc: any = {
    tgl: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
    emrfk:1
  }
  jenisEMR = 'asesmen'
  displayDialog: boolean
  title: any
  public rows: any;
  public ColumnMode = ColumnMode;
  isLoad: boolean

  loading: boolean = false
  options: any
  contentHeader: any
  showTarif: boolean
  private _unsubscribeAll: Subject<any>
  listRuangan: any[]//SelectItem[]
  listJenisPel: any[]//SelectItem[]
  listKelas: any[]//SelectItem[]
  isKritik: boolean
  isKeluhan: boolean
  isQuis: boolean
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private cacheHelper: CacheService,
    private http: HttpClient,
    private alertService: ToastrService,
    private modalService: NgbModal,
    public formatter: NgbDateParserFormatter,

  ) { this.options = this.alertService.toastrConfig; }


  ngOnInit(): void {

    this.contentHeader = {
      headerTitle: 'Kritik & Saran',
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
  loadQuisoner() {
    var chekedd = false
    this.httpService.get("medifirst2000/kiosk/get-quisoner?emrid=" + this.namaEMR).subscribe(e => {
      this.listData = e
      this.item.title = e.title
      this.item.classgrid = e.classgrid

      this.item.objcbo = []

      this.httpService.get("medifirst2000/kiosk/get-quisoner-transaksi-detail?noemr=" + this.nomorEMR + "&emrfk=" + this.namaEMR).subscribe(dat => {
        this.item.obj = []
        this.item.obj2 = []
        let dataLoad = dat.data
        for (var i = 0; i <= dataLoad.length - 1; i++) {
          if (parseFloat(this.namaEMR) == dataLoad[i].emrfk) {
            if (dataLoad[i].type == "textbox") {
              this.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
            }
            if (dataLoad[i].type == "checkbox") {
              chekedd = false
              if (dataLoad[i].value == '1') {
                chekedd = true
              }
              this.item.obj[dataLoad[i].emrdfk] = chekedd
            }
            if (dataLoad[i].type == "radio") {
              this.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
            }
            if (dataLoad[i].type == "datetime") {
              this.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
            }
            if (dataLoad[i].type == "time") {
              var momenst = moment(new Date()).format('YYYY-MM-DD')
              this.item.obj[dataLoad[i].emrdfk] = new Date(momenst + ' ' + dataLoad[i].value)
            }
            if (dataLoad[i].type == "date") {

              this.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
            }

            if (dataLoad[i].type == "checkboxtextbox") {
              this.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
              this.item.obj2[dataLoad[i].emrdfk] = true
            }
            if (dataLoad[i].type == "textarea") {
              this.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
            }
            if (dataLoad[i].type == "combobox") {
              var str = dataLoad[i].value
              var res = str.split("~");
              this.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

            }
          }

        }

      })

    });
  }
  // modal Open Success
  modalOpenSuccess(modalSuccess) {
    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: 'modal modal-success'
    });
  }
  showPopUp(data) {
    this.isKritik = 'isKritik' == data ? true : false
    this.isKeluhan = 'isKeluhan' == data ? true : false
    this.isQuis = 'isQuis' == data ? true : false
    if (this.isQuis) {
      this.loadQuisoner()
    }
    // this[data] = !this[data]
  }
  closeAll() {
    this.isKritik = false
    this.isKeluhan = false
    this.isQuis = false
    this.item = {
      obj: [],
      obj2: [],
      deskripsi: '',
      tgl: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    }
  }

  changePel(event) {
    if (event.target.defaultValue == '') return
    this.httpService.get("medifirst2000/kiosk/get-data-ruangan?jenis=" + event.target.defaultValue).subscribe(e => {

      this.listRuangan = [];
      this.listRuangan.push({ label: '-- Ruangan --', value: null });
      e.ruangan.forEach(response => {
        this.listRuangan.push({
          label: response.namaruangan,
          value: {
            'id': response.id,
            'namaruangan': response.namaruangan
          }
        });
      });
    })
  }

  CountAge(birthday, dataNow) {

    if (birthday === undefined || birthday === '')
      birthday = Date.now();
    else {
      if (birthday instanceof Date) {

      } else {
        var arr = birthday.split('-');
        if (arr[0].length === 4) {
          birthday = new Date(arr[0], arr[1], arr[2]);
        } else {
          birthday = new Date(arr[2], arr[1], arr[0]);
        }
      }

    }
    if (dataNow === undefined)
      dataNow = Date.now();
    var ageDifMs = dataNow - birthday;
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    var year = ageDate.getFullYear() - 1970;
    if (year <= -1)
      year = 0;
    var day = ageDate.getDate() - 1;
    var date = new Date(year, ageDate.getMonth(), day);
    return {
      year: year,
      month: ageDate.getMonth(),
      day: day,
      date: date
    };
  }
  saveKeluhan() {
    if (!this.kom.namaPengisi) {
      this.alertService.warning('', 'Nama Pengisi harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (!this.kom.namapasien) {
      this.alertService.warning('', 'Nama Pasien harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }

    if (!this.kom.komplain) {
      this.alertService.warning('', 'Keluhan / Komplain harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (!this.kom.tanggapan) {
      this.alertService.warning('', 'Tanggapan harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }

    let data = {
      "id": "",
      "alamat": this.kom.alamat ? this.kom.alamat : '',
      "email": "",
      "keluhan": this.kom.komplain,
      "namapasien": this.kom.namapasien,
      "norm": "",
      "notlp": "",
      "objectruanganfk": this.kom.ruangan ? this.kom.ruangan.value.id : null,
      "saran": this.kom.tanggapan,
      "objectpekerjaanfk": null,
      "umur": null,
      "tglkeluhan": this.formatter.format(this.kom.tgl),
      "tglorder": null,
      "notlpkntr": null,
      "objectjeniskelaminfk": null,
      "namapengisi": this.kom.namaPengisi
    }
    var json = {
      data: data,
    }
    this.httpService.post("medifirst2000/kiosk/save-keluhan-pelanggan", json).subscribe(e => {
      this.closeAll()
    })
  }
  saveKritik() {
    if (!this.item.namaPengisi) {
      this.alertService.warning('', 'Nama Pengisi harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (!this.item.namapasien) {
      this.alertService.warning('', 'Nama Pasien harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (!this.item.noHp) {
      this.alertService.warning('', 'No HP harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (!this.item.kritik) {
      this.alertService.warning('', 'Kritik & Saran harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    let umur = ''
    if (this.item.tgllahir) {
      let tgllahir = this.formatter.format(this.item.tgllahir)

      var age: any = this.CountAge(new Date(tgllahir), new Date());
      var bln = age.month,
        thn = age.year,
        day = age.day
      umur = thn + 'thn ' + bln + 'bln ' + day + 'hr '
    }

    let data = {
      "id": "",
      "alamat": "",
      "email": "",
      "keluhan": "",
      "namapasien": this.item.namapasien,
      "norm": "",
      "notlp": this.item.noHp,
      "objectruanganfk": this.item.ruangan ? this.item.ruangan.value.id : null,
      "saran": this.item.kritik,
      "objectpekerjaanfk": null,
      "umur": umur,
      "tglkeluhan": this.formatter.format(this.item.tgl),
      "tglorder": null,
      "notlpkntr": null,
      "objectjeniskelaminfk": null,
      "namapengisi": this.item.namaPengisi
    }
    var json = {
      data: data,
    }
    this.httpService.post("medifirst2000/kiosk/save-keluhan-pelanggan", json).subscribe(e => {
      this.closeAll()
    })
  }
  saveQuis() {
    if (!this.cc.namaPengisi) {
      this.alertService.warning('', 'Nama Pengisi harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (!this.cc.namapasien) {
      this.alertService.warning('', 'Nama Pasien harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (!this.cc.norm) {
      this.alertService.warning('', 'No RM harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    
    var arrobj = Object.keys(this.item.obj)
    var arrSave = []
    for (var i = arrobj.length - 1; i >= 0; i--) {
      if (this.item.obj[parseInt(arrobj[i])] instanceof Date)
        this.item.obj[parseInt(arrobj[i])] = moment(this.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
      arrSave.push({ id: arrobj[i], values: this.item.obj[parseInt(arrobj[i])] })
    }
    this.cc.jenisemr = 'quisoner'
    var jsonSave = {
      head: this.cc,
      data: arrSave
    }
    this.httpService.post("medifirst2000/kiosk/save-quiz", jsonSave).subscribe(e => {
      this.closeAll()
    });
  }
}

