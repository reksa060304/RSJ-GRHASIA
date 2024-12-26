import { Component, OnInit, ViewChild, OnDestroy, Injectable } from '@angular/core';
import { DropdownModule, SelectItem, InplaceModule, MenuItem, ConfirmationService } from 'primeng/primeng';
import { SocketService } from "./socket.service";
import {
  HttpClient,
  UserDto,
  Authentication,
  AuthGuard,
  AlertService,
  InfoService,
  Configuration
} from '../../../../helper';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
//import * as mdb from 'mdbootstrap';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import { BrowserQRCodeReader, VideoInputDevice } from 'zxing-typescript/src/browser/BrowserQRCodeReader'
import QRCode from 'qrcode';
// import { ImageViewerConfig } from 'ngx-image-viewer';

// import { JsBarcode } from 'JsBarcode';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export interface Ruangan {
  namaruangan: string;
  objectdepartemenfk: any;
  id: any
}
export interface Dokter {
  namalengkap: string;
  id: any
}
@Component({
  selector: 'app-reservasi-online',
  templateUrl: './reservasi-online.component.html',
  styleUrls: ['./reservasi-online.component.scss'],
  // encapsulation: ViewEncapsulation.None
  providers: [ConfirmationService]
})
export class ReservasiOnlineComponent implements OnInit {
  isGeneralConsent: boolean = false
  isSetuju: boolean = false
  loading: boolean = false;
  isBaru: boolean = false
  isLama: boolean = false
  // minDate = new Date()
  minDate = new Date(new Date().setDate(new Date().getDate() + 1))
  maxDate: any
  model: any = {};
  stepsMenuItems: MenuItem[];
  activeIndex: number = 0;
  listJK: any[] = []
  listAgama: any[] = []
  listStatusKawin: any[] = []
  listGolonganDarah: any[]= []
  listPekerjaan: any[]=[]
  listPendidikan: any[]=[]
  listHambatanKomunikasi: any[] = []
  // listRuangan: any[] = []
  // listDokter: any = []
  listTipePembayaran: any[] = []
  isSelected1: any;
  isSelected2: any;
  formGroup: FormGroup;
  formHistory: FormGroup;
  formPelayanan: FormGroup;
  myControl = new FormControl();
  isLoading: boolean
  isAsuransi: boolean = false
  filteredOptions: Observable<string[]>;
  items2: MenuItem[];
  activeItem: MenuItem;
  loadingHistory: boolean = false
  @ViewChild('menuItems') menu: MenuItem[];
  dataSource: any[]
  listJenisPasien: any[] = [{ 'id': 1, 'jenis': 'Baru', 'src': 'assets/humastemplate/images/pasien-baru1.png', 'style': 'kanan', 'images': 'ex-image-a' },
  { 'id': 2, 'jenis': 'Lama', 'src': 'assets/humastemplate/images/pasien-lama.png', 'style': '', 'images': 'ex-image-b' }]
  selection: any = {}
  imageIndex: any = 0
  // imagesDenah: any="assets/img/denah_rs.jpg";
  images = [
    'assets/img/denah_rs.jpg',
    // 'https://i.ytimg.com/vi/nlYlNF30bVg/hqdefault.jpg',
    // 'https://www.askideas.com/media/10/Funny-Goat-Closeup-Pouting-Face.jpg'
  ];
  displayDialog: boolean = false;
  kodeReservasi: any;
  tglReservasi: any;
  poliTujuan: any;
  noantrianRuangan: any;
  dokter: any;
  Estimasi:any
  jamR:any
  qrCode: any;
  isBuktiReservasi: boolean = false
  namaPasien: any;
  // displayDialog: boolean;
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;
  isCollalsedPasien: boolean = true
  displayPopUpQr: boolean = false
  linkBarcode = 'https://barcode.tec-it.com/barcode.ashx?data='
  barCode: any
  linkBarcode2 = '&code=Code128&dpi=96&dataseparator='
  listJam: any = []
  loadSlot: boolean = false
  dataSlot: any[]
  disableSelect = new FormControl(false);
  isBPJS: boolean = false
  myFilter: any;
  maxJamReservasi: string
  rentangReservasi: any
  listHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  simpanVisible: boolean = true
  isShowRiwayatPelayanan: boolean
  item: any = {}
  isShowRincian: boolean = true
  dataSourceRincian: any[]
  rowGroupMetadata: any;
  totalTagihan: any
  totalTerbilang: any
  deposit: any
  totalBayar: any
  sisaTagihan: any
  noBpjs: any
  noCmfk: any
  selectedItemGridRiwayat: any
  displayDialogRM: boolean
  dataSourceRm: any[]
  totalKlaim: any;
  isShowRiwayatRegis: boolean;
  dataSourceBank: any[]
  dataSourceJadwalDokter: any[];
  dataSourceInfoTT: any[];
  selectedNorek: any
  titleKlaim: any = 'Total Klaim'
  statusRujukanBerlaku: any = true
  isPanduanReservasi: boolean
  itemsPanduan: MenuItem[];
  isDukcapil: boolean
  imageIndexOne = 0;
  imageIndexTwo = 0;

  config: ImageViewerConfig = {
    btnClass: 'default', // The CSS class(es) that will apply to the buttons
    zoomFactor: 0.1, // The amount that the scale will be increased by
    containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
    wheelZoom: true, // If true, the mouse wheel can be used to zoom in
    allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
    allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
    btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
      zoomIn: 'fa fa-plus',
      zoomOut: 'fa fa-minus',
      rotateClockwise: 'fa fa-repeat',
      rotateCounterClockwise: 'fa fa-undo',
      next: 'fa fa-arrow-right',
      prev: 'fa fa-arrow-left',
      fullscreen: 'fa fa-arrows-alt',
    },
    btnShow: {
      zoomIn: true,
      zoomOut: true,
      rotateClockwise: false,
      rotateCounterClockwise: false,
      next: false,
      prev: false
    }
  }; // {customBtns: [{name: 'print', icon: 'fa fa-print'}, {name: 'link', icon: 'fa fa-link'}]};
  poliKlinik = new FormControl();
  listRuangan: Ruangan[] = []
  listRuanganF: Observable<Ruangan[]>;
  dokter2 = new FormControl();
  listDokter: Dokter[] = []
  // listRuanganF: Observable<string[]>;
  listDokterF: Observable<Dokter[]>;
  handleEvent(event: CustomEvent) {
    console.log(`${event.name} has been click on img ${event.imageIndex + 1}`);

    switch (event.name) {
      case 'print':
        console.log('run print logic');
        break;
    }
  }
  constructor(private httpService: HttpClient,
    private messageService: AlertService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private socket: SocketService
  ) {

  }

  displayFn(user: Ruangan): string {
    return user && user.namaruangan ? user.namaruangan : '';
  }
  displayFn2(user: Dokter): string {
    return user && user.namalengkap ? user.namalengkap : ''
  }

  private _filter(name: string): Ruangan[] {
    const filterValue = name.toLowerCase();
    return this.listRuangan.filter(option => option.namaruangan.toLowerCase().includes(filterValue));
  }
  private _filter2(name: string): Dokter[] {
    const filterValue = name.toLowerCase();
    return this.listDokter.filter(option => option.namalengkap.toLowerCase().includes(filterValue));
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
  saveTidakSetuju(){
    if(this.isSetuju == false){
    localStorage.setItem('GeneralConsent', 'false')
      this.isGeneralConsent = false
    }
  }
  saveSetuju(){
    if(this.isSetuju == true){
      this.isGeneralConsent = false
      localStorage.setItem('GeneralConsent', 'true')
    }
  }
  ngOnInit() {
    // var ssn = document.getElementById('ssn');
    var ssn = (<HTMLInputElement>document.getElementById('ssn'));
    this.isGeneralConsent = true
    // ssn.addEventListener('input', this.ssnMask, false);
    // var ssnFirstFive = "";
    // var secondHalf = "";
    // var fullSSN = "";

    // let namafield = 'isRentangReservasi'
    // this.httpService.get('medifirst2000/sysadmin/settingdatafixed/get/' + namafield).subscribe(resp => {
    //   this.maxDate = new Date(new Date().setDate(new Date().getDate() + resp))
    // }, error => {
    //   this.maxDate = new Date(new Date().setDate(new Date().getDate() + 28))
    // })
    this.httpService.get('medifirst2000/reservasionline/get-list-data').subscribe(e => {
      this.maxJamReservasi = e.maxJamReservasi
      this.maxDate = new Date(new Date().setDate(new Date().getDate() + e.isRentangReservasi))
      e.jeniskelamin.forEach(element => {
        this.listJK.push(element)
      });

      e.ruanganrajal.forEach(element => {
        this.listRuangan.push(element)
      });
      e.agama.forEach(element => {
        this.listAgama.push(element)
      });
      e.statusperkawinan.forEach(element => {
        this.listStatusKawin.push(element)
      });
      e.golongandarah.forEach(element => {
        this.listGolonganDarah.push(element)
      });
      e.pendidikan.forEach(element => {
        this.listPendidikan.push(element)
      });
      e.pekerjaan.forEach(element => {
        this.listPekerjaan.push(element)
      });
      e.hambatankomunikasi.forEach(element => {
        this.listHambatanKomunikasi.push(element)
      });
      // e.dokter.forEach(element => {
      //   this.listDokter.push(element)
      // });

      e.kelompokpasien.forEach(element => {
        this.listTipePembayaran.push(element)
      });

      let arr = []
      if (e.libur.length > 0) {
        for (let i = 0; i < e.libur.length; i++) {
          const element = e.libur[i];
          arr.push(element.tgllibur)
        }
      }
      this.myFilter = (d): boolean => {
        const day: number = d._d.getDay()
        if(arr.length>0){
          for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (moment(d._d).format('YYYY/MM/DD') == element) {
              return false
            }
          }
        }

        // Prevent Saturday and Sunday from being selected.
        // return day != 0 && day != 6 ? true : false;
       return day != 0  ? true : false;
      }

      // this.getMaxJamReservasis()

      this.loadNoRek()
    }, error => {
      this.maxDate = new Date(new Date().setDate(new Date().getDate() + 28))
    })
    //
    // this.httpService.get('medifirst2000/reservasionline/get-libur').subscribe(e => {

    //   //['2019-05-30', '2019-05-31', '2019-06-01', '2019-06-03', '2019-06-04', '2019-06-05', '2019-06-06', '2019-06-07']

    // })

    // $("#barcode").JsBarcode("Hi!");
    // $("#barcode").barcode("1234567890128", "ean13");

    // JsBarcode("#barcode", "Hi world!");
    // this.carService.getCarsLarge().then(cars => this.cars = cars);

    // $('#input_starttime').pickatime({
    //   // Light or Dark theme
    //   darktheme: true
    //   });
    //buat menunya disini
    this.items2 = [
      { label: 'Reservasi', icon: 'fa fa-fw fa-calendar' },
      { label: 'History', icon: 'fa fa-fw fa-history' },
      // { label: 'Slotting', icon: 'fa fa-fw fa fa-calendar-check-o' },
      { label: 'E-Billing', icon: 'fa fa-fw fa-heartbeat' },
      // { label: 'Bank Account', icon: 'fa fa-fw fa fa-bank' },
      { label: 'Panduan', icon: 'fa fa-fw fa-question-circle' },
      { label: 'Jadwal Profesional Pemberi Asuhan', icon: 'fa fa-fw fa-stethoscope' },
      { label: 'Info Tempat Tidur', icon: 'fa fa-fw fa-bed' },

      // { label: 'Denah', icon: 'fa fa-fw fa-map-marker' },
    ];

    this.activeItem = this.items2[0];
    this.formGroup = this.fb.group({
      'namaPasien': new FormControl(null),
      'jenisKelamin': new FormControl(null),
      'tglLahir': new FormControl(null),
      'noTelpon': new FormControl(null),
      'noCm': new FormControl(null),
      'tglLahirLama': new FormControl(null),
      'dokter': new FormControl(null),
      'poliKlinik': new FormControl(null),
      'tipePembayaran': new FormControl(null),
      'tglReservasi': new FormControl({ value: null, disabled: true }),
      'noKartuPeserta': new FormControl(null),
      'jamReservasi': new FormControl(null),
      'noRujukan': new FormControl(null),
      'resumeNoRM': new FormControl({ value: null, disabled: true }),
      'resumeNama': new FormControl({ value: null, disabled: true }),
      'resumeNamaDukcapil': new FormControl({ value: null, disabled: true }),
      'resumeTglLahir': new FormControl({ value: null, disabled: true }),
      'resumeJK': new FormControl({ value: null, disabled: true }),
      'resumeNoTelp': new FormControl({ value: null, disabled: true }),
      'resumeTglReservasi': new FormControl({ value: null, disabled: true }),
      'resumePoli': new FormControl({ value: null, disabled: true }),
      'resumeDokter': new FormControl({ value: null, disabled: true }),
      'resumeTipe': new FormControl({ value: null, disabled: true }),
      'resumNoka': new FormControl({ value: null, disabled: true }),
      'resumNoRujukan': new FormControl({ value: null, disabled: true }),
      'tglReservasiFix': new FormControl(null),
      'isBaru': new FormControl(null),
      'tglAwal': new FormControl(null),
      'tglAkhir': new FormControl(null),
      'nik': new FormControl(null),
      'resumeNIK': new FormControl({ value: null, disabled: true }),
      'namaPasienDukcapil': new FormControl(null),
      'alamatLengkap': new FormControl(null),
      'tempatLahir': new FormControl(null),
      'agamaPasien': new FormControl(null),
      'statusPerkawinan': new FormControl(null),
      'golonganDarah': new FormControl(null),
      'pendidikan': new FormControl(null),
      'pekerjaan': new FormControl(null),
      'hambatanKomunikasi': new FormControl(null),
      'nikPenanggungJawab': new FormControl(null),
      'namaPenanggungJawab': new FormControl(null),
      'noTelponPenanggungJawab': new FormControl(null),
      'alamatLengkapPenanggungJawab': new FormControl(null),
    });

    this.sortOptions = [
      { label: 'Newest First', value: '!year' },
      { label: 'Oldest First', value: 'year' },
      { label: 'Brand', value: 'brand' }
    ];
    this.formHistory = this.fb.group({
      'noCm': new FormControl(null),
      'namaPasien': new FormControl({ value: null, disabled: true }),
      'tglLahir': new FormControl({ value: null, disabled: false }),
      'tglLahir2': new FormControl(null),
      'noTelpon': new FormControl({ value: null, disabled: true }),
      'alamat': new FormControl({ value: null, disabled: true }),
      'noAsuransi': new FormControl({ value: null, disabled: true }),
      'jenisKelamin': new FormControl({ value: null, disabled: true }),
      'pendidikan': new FormControl({ value: null, disabled: true }),
      'pekerjaan': new FormControl({ value: null, disabled: true }),
      'tempatLahir': new FormControl({ value: null, disabled: true }),
      'noBPJS': new FormControl({ value: null, disabled: true }),
      'nik': new FormControl({ value: null, disabled: true }),
      'sortKey': new FormControl(null),
    });

    this.formPelayanan = this.fb.group({
      'noRegistrasi': new FormControl(null),
      'noRm': new FormControl(null),

    });
    this.setSourceStepMenu()
    this.setSourceCombo()

    // this.formGroup.controls['tipePembayaran'].valueChanges.subscribe(
    //   (selectedValue) => {
    //     if (selectedValue.id == 2) {
    //       // this.isAsuransi = false
    //       this.isBPJS = true

    //     } else {
    //       // this.isAsuransi = true
    //       this.isBPJS = false

    //     }
    //   }
    // );
    // var ssn = document.getElementById('idNamaPasien');
    // ssn.addEventListener('input', this.ssnMask(ssn), false);
    this.listRuanganF = this.poliKlinik.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.namaruangan)),
      map(name => (name ? this._filter(name) : this.listRuangan.slice())),
    );
    this.listDokterF = this.dokter2.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.namalengkap)),
      map(name => (name ? this._filter2(name) : this.listDokter.slice())),
    );
    this.dataSourceJadwalDokter = []

    this.httpService.get('medifirst2000/reservasionline/daftar-jadwal-dokter').subscribe(e => {
      this.dataSourceJadwalDokter = e.jddokter
    }, error => {
    })

    this.dataSourceJadwalDokter = []
    this.httpService.get('medifirst2000/reservasionline/daftar-info-tt').subscribe(e => {
      this.dataSourceInfoTT = e.data
      console.log(e);
    }, error => {
    })



  }
  setValueRu(eve) {
    this.formGroup.get('poliKlinik').setValue(eve.value)
    this.getSlotRu(eve)
  }
  setValueDok(dok) {
    this.formGroup.get('dokter').setValue(dok.value)
    this.getSlotDok(dok)
  }
  ssnMask() {
    var ssn = (<HTMLInputElement>document.getElementById('ssn'));

    if (ssn.value.length <= 5) {
      ssn.type = 'password';
    }
    else {
      var ssnFirstFive = "";
      var secondHalf = "";
      var fullSSN = "";
      this.detectChanges(ssn);
      secondHalf = ssn.value.substring(5);
      ssn.type = 'text';
      ssn.value = "•••••";
      ssn.value += secondHalf;
      fullSSN = ssnFirstFive + secondHalf;
    }
  }

  detectChanges(ssn) {
    var ssnFirstFive = "";
    var secondHalf = "";
    var fullSSN = "";
    for (var i = 0; i < 5; i++) {
      if (ssn.value[i] != "•") {
        ssnFirstFive = ssnFirstFive.substring(0, i) + ssn.value[i] + ssnFirstFive.substring(i + 1);
      }
    }
  }
  getNik() {
    let nik = this.formGroup.get('nik').value
    if (nik != null && nik.length > 10)
      this.isDukcapil = false

    let prov = {
      "url": "Peserta/nik/" + nik + "/tglSEP/" + moment(new Date()).format('YYYY-MM-DD'),
      "method": "GET",
      "data": null
    }

    this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", prov).subscribe(e => {
      if (e.metaData.code == 200) {
        this.messageService.success('Info', e.metaData.message)
        var result = e.response.peserta
        let namaPasien = result.nama
        let subStr = namaPasien.substring(0, 5)
        this.isDukcapil = true
        // this.formHistory.get('namaPasien').setValue(subStr + ' ********')
        this.messageService.success('Sukses', 'Nama Lengkap : ' + subStr + ' ********')
        this.formGroup.get('namaPasien').setValue(result.nama)
        this.formGroup.get('namaPasienDukcapil').setValue(subStr + ' ********')

        var jkn = result.sex == 'L' ? 1 : 2
        for (let i = 0; i < this.listJK.length; i++) {
          const element = this.listJK[i];
          if (element.id == jkn) {
            this.formGroup.get('jenisKelamin').setValue(element)
            break
          }
        }
        this.formGroup.get('tglLahir').setValue(new Date(result.tglLahir))
        this.formGroup.get('namaPasien').setValue(result.nama)
        this.formGroup.get('noTelpon').setValue(result.mr.noTelepon)
        this.formGroup.get('noKartuPeserta').setValue(result.noKartu)

      } else {
        this.messageService.info('Info', e.metaData.message)
      }
    }, function (err) {
      this.isDukcapil = false
    })
    // this.httpService.get('medifirst2000/bridging/dukcapil/get-nik/' + nik).subscribe(e => {
    //   if (e.content == undefined) {
    //     return
    //   }
    //   if (e.messages) {
    //     this.messageService.error('Error', e.messages)
    //     return
    //   }
    //   if (e.content[0] != "") {
    //     let result = e.content[0]
    //     let namaPasien = result.NAMA_LGKP
    //     let subStr = namaPasien.substring(0, 5)
    //     this.isDukcapil = true
    //     // this.formHistory.get('namaPasien').setValue(subStr + ' ********')
    //     this.messageService.success('Sukses', 'Nama Lengkap : ' + subStr + ' ********')
    //     this.formGroup.get('namaPasien').setValue(result.NAMA_LGKP)
    //     this.formGroup.get('namaPasienDukcapil').setValue(subStr + ' ********')


    //     for (let i = 0; i < this.listJK.length; i++) {
    //       const element = this.listJK[i];
    //       if (element.jeniskelamin.toLowerCase().indexOf(result.JENIS_KLMIN.toLowerCase()) > -1) {
    //         this.formGroup.get('jenisKelamin').setValue(element)
    //         break
    //       }
    //     }
    //     this.formGroup.get('tglLahir').setValue(new Date(result.TGL_LHR))
    //     this.formGroup.get('namaPasien').setValue(result.NAMA_LGKP)
    //   } else {
    //     this.messageService.error('Info', e.content.RESPON)
    //   }
    // }, function (err) {
    //   this.isDukcapil = false
    // });

  }
  changeTipeBayar(event) {
    if (event.value.id == 2) {
      if (!this.isBaru && this.noBpjs) {
        this.formGroup.get('noKartuPeserta').setValue(this.noBpjs)
        this.formGroup.get('noRujukan').setValue("-")
      }
      this.isBPJS = true
    } else {
      if (!this.isBaru) {
        this.formGroup.get('noKartuPeserta').reset()
        this.formGroup.get('noRujukan').reset()
      }
      this.isBPJS = false
    }
  }
  onMenuButtonClick(event) {
    this.activeItem = {
      icon: "fa fa-fw fa-history",
      label: "History"
    }
  }
  selectedJenis2(select) {
    if (select.id == 1) {
      this.isBaru = true
      this.isLama = false
    } else if (select.id == 2) {
      this.isBaru = false
      this.isLama = true
    } else {
      this.isBaru = false
      this.isLama = false
    }
    this.selection.selectedJenis2 = select;
  }
  closeItem(event, index) {
    this.items2 = this.items2.filter((item, i) => i !== index);
    event.preventDefault();
  }
  activateMenu() {
    this.activeItem = this.menu['activeItem'];
    if (this.activeItem.label == "Reservasi") {
      console.log(localStorage.getItem('GeneralConsent'));

      if(localStorage.getItem('GeneralConsent') == 'true'){
        this.isGeneralConsent = false
      }else
      if(localStorage.getItem('GeneralConsent') != 'true'){
        this.isGeneralConsent = true
      }
      this.activeIndex = 0;
    }
    // if (this.activeItem.label == "Bank Account") {
    //   this.loadNoRek()
    // }

  }
  loadNoRek() {
    this.dataSourceBank = []

    this.httpService.get('medifirst2000/reservasionline/get-bank-account')
      .subscribe(response => {

        this.dataSourceBank = response.data
      }, error => {
        this.dataSourceBank = []
      })
  }
  clearHistory() {
    this.formHistory.get('noCm').reset()
    this.formHistory.get('tglLahir').reset()
  }
  editHistory(selected) {

  }
  hapusHistory(selected) {
    if(selected.isconfirm ==true ){
      this.messageService.warn('Info', 'Reservasi yg sudah confirm tidak bisa dibatalkan')
      return
    }
    let data = {
      'norec': selected.norec
    }
    this.confirmationService.confirm({
      message: 'Yakin mau batal reservasi?',
      accept: () => {
        this.httpService.post('medifirst2000/reservasionline/delete', data).subscribe(res => {
          this.findHistory()

        }, error => {

        })
      }
    })
  }
  cetakHistory(selected) {
    this.kodeReservasi = selected.noreservasi
    this.tglReservasi = selected.tanggal
    this.jamR =  selected.jamreservasi
    this.poliTujuan = selected.namaruangan
    this.noantrianRuangan = selected.noantrian
    this.dokter = selected.dokter
    this.Estimasi = selected.tanggalreservasi
    this.namaPasien = selected.namapasien
    this.barCode = this.linkBarcode + selected.noreservasi + this.linkBarcode2
    QRCode.toDataURL(selected.noreservasi)
      .then(url => {
        this.qrCode = url
        console.log(url)
      })
      .catch(err => {
        console.error(err)
      })
    this.isBuktiReservasi = true
    // this.displayDialog = true
  }
  findHistory() {

    this.loadingHistory = true
    let noCM = null;
    let tglLahirLama = null;
    console.log(this.formHistory.get('noCm').value);

    if (this.formHistory.get('noCm').value == undefined) {
      this.messageService.warn('Peringatan', 'Nama atau No CM harus di isi !')
      return
    }

    if (this.formHistory.get('tglLahir').value == undefined) {
      this.messageService.warn('Peringatan', 'Tgl Lahir harus di isi !')
      return
    }
    noCM = this.formHistory.get('noCm').value
    tglLahirLama = moment(this.formHistory.get('tglLahir').value).format('DD-MM-YYYY')

    this.httpService.get('medifirst2000/reservasionline/get-history?nocmNama=' + noCM + '&tgllahir=' + tglLahirLama).subscribe(res => {
      this.loadingHistory = false
      if (res.data.length > 0) {
        this.isCollalsedPasien = false
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];

          let tglReserDay = new Date(element.tanggalreservasi)
          let _hari = tglReserDay.getDay();
          let hariFix = this.listHari[_hari]
          element.tanggalreservasi = hariFix + ', ' + moment(new Date(element.tanggalreservasi)).format('DD/MMM/YYYY HH:mm') //HH:mm
          element.tanggal = hariFix + ', ' + moment(new Date(element.tanggal)).format('DD/MMM/YYYY') //HH:mm
        }
        let namaPasien = res.data[0].namapasien
        let subStr = namaPasien.substring(0, 5)

        this.formHistory.get('namaPasien').setValue(subStr + '********')
        // this.formHistory.get('namaPasien').setValue(res.data[0].namapasien)
        this.formHistory.get('jenisKelamin').setValue(res.data[0].jeniskelamin)
        let notelp = ''
        if (res.data[0].notelepon == null)
          res.data[0].notelepon = ''
        if (res.data[0].nohp == null)
          res.data[0].nohp = ''
        notelp = res.data[0].notelepon + ' - ' + res.data[0].nohp
        this.formHistory.get('nik').setValue(res.data[0].noidentitas)
        this.formHistory.get('tempatLahir').setValue(res.data[0].tempatlahir)
        this.formHistory.get('noTelpon').setValue(notelp)
        // this.formHistory.get('noBPJS').setValue(res.data[0].nobpjs != null ? res.data[0].nobpjs : '-')
        this.formHistory.get('noAsuransi').setValue(res.data[0].nobpjs != null ? res.data[0].nobpjs : '-' +
          ' / ' + res.data[0].noasuransilain != null ? res.data[0].noasuransilain : '-')
        this.formHistory.get('alamat').setValue(res.data[0].alamatlengkap)
        this.formHistory.get('pekerjaan').setValue(res.data[0].pekerjaan)
        this.formHistory.get('pendidikan').setValue(res.data[0].pendidikan)

        this.dataSource = res.data
      } else {
        this.dataSource = []
        this.isCollalsedPasien = true
        this.messageService.info('Info', 'Data tidak ada')
      }

    }, error => {
      this.isCollalsedPasien = true
      this.dataSource = []
      this.loadingHistory = false
      this.messageService.info('Info', 'Data tidak ada')
    })
  }

  setSourceStepMenu() {
    this.stepsMenuItems = [
      {
        label: 'Jenis Pasien',
        command: (event: any) => {
          this.activeIndex = 0;
        }
      },
      {
        label: 'Tgl Reservasi & Poli',
        command: (event: any) => {
          this.activeIndex = 1;

        }
      },
      {
        label: 'Resume',
        command: (event: any) => {
          this.activeIndex = 2;
        }
      },
      // {
      //   label: '',
      //   command: (event: any) => {
      //     this.activeIndex = 3;

      //   }
      // },
    ];
  }
  selectedJenis(e, color) {
    if (e == 1) {
      this.isBaru = true
      this.isLama = false
    } else if (e == 2) {
      this.isBaru = false
      this.isLama = true
    } else {
      this.isBaru = false
      this.isLama = false
    }
  }

  nextWizard(valueIndex) {
    let noCM = this.formGroup.get('noCm').value
    let jenisKelamin = this.formGroup.get('jenisKelamin').value
    let tglLahir = this.formGroup.get('tglLahir').value
    let noTelpon = this.formGroup.get('noTelpon').value
    let namaPasien = this.formGroup.get('namaPasien').value
    let tglLahirLama = this.formGroup.get('tglLahirLama').value
    let nik = this.formGroup.get('nik').value
    let tempatLahir = this.formGroup.get('tempatLahir').value
    let agamaPasien = this.formGroup.get('agamaPasien').value
    let statusPerkawinan = this.formGroup.get('statusPerkawinan').value
    let golonganDarah = this.formGroup.get('golonganDarah').value
    let pendidikan = this.formGroup.get('pendidikan').value
    let pekerjaan = this.formGroup.get('pekerjaan').value
    let hambatanKomunikasi = this.formGroup.get('hambatanKomunikasi').value
    let alamatLengkap = this.formGroup.get('alamatLengkap').value
    let nikPenanggungJawab = this.formGroup.get('nikPenanggungJawab').value
    let namaPenanggungJawab = this.formGroup.get('namaPenanggungJawab').value
    let noTelponPenanggungJawab = this.formGroup.get('noTelponPenanggungJawab').value
    let alamatLengkapPenanggungJawab = this.formGroup.get('alamatLengkapPenanggungJawab').value

    if (valueIndex == 1) {
      if(localStorage.getItem('GeneralConsent') != 'true'){
        this.messageService.warn('Info','Anda tidak setuju dengan informasi yang berlaku')
        return
      }
      if (this.isBaru) {
        if (!nik) {
          this.messageService.warn('Peringatan', 'NIK harus di isi !')
          return
        }
        if (!namaPasien) {
          this.messageService.warn('Peringatan', 'Nama Pasien harus di isi !')
          return
        }
        if (!tglLahir) {
          this.messageService.warn('Peringatan', 'Tgl Lahir harus di isi !')
          return
        }
        if (!jenisKelamin) {
          this.messageService.warn('Peringatan', 'Jenis Kelamin harus di pilih !')
          return
        }
        if (!noTelpon) {
          this.messageService.warn('Peringatan', 'No Telepon harus di isi !')
          return
        }
        if (!tempatLahir) {
          this.messageService.warn('Peringatan', 'Tempat Lahir harus di isi !')
          return
        }
        if (!agamaPasien) {
          this.messageService.warn('Peringatan', 'Agama harus di isi !')
          return
        }
        if (!statusPerkawinan) {
          this.messageService.warn('Peringatan', 'Status Perkawinan harus di isi !')
          return
        }
        if (!golonganDarah) {
          this.messageService.warn('Peringatan', 'Golongan Darah harus di isi !')
          return
        }
        if (!pendidikan) {
          this.messageService.warn('Peringatan', 'Pendidikan harus di isi !')
          return
        }
        if (!pekerjaan) {
          this.messageService.warn('Peringatan', 'Pekerjaan harus di isi !')
          return
        }
        if (!hambatanKomunikasi) {
          this.messageService.warn('Peringatan', 'Hambatan Komunikasi harus di isi !')
          return
        }
        if (!alamatLengkap) {
          this.messageService.warn('Peringatan', 'Alamat Lengkap harus di isi !')
          return
        }
        if (!alamatLengkapPenanggungJawab) {
          this.messageService.warn('Peringatan', 'Alamat Penanggung Jawab harus di isi !')
          return
        }
        if (!nikPenanggungJawab) {
          this.messageService.warn('Peringatan', 'NIK Penanggung Jawab harus di isi !')
          return
        }
        if (!namaPenanggungJawab) {
          this.messageService.warn('Peringatan', 'Nama Penanggung Jawab harus di isi !')
          return
        }
        if (!noTelponPenanggungJawab) {
          this.messageService.warn('Peringatan', 'No Telepon Penanggung Jawab harus di isi !')
          return
        }
        if (nik.length > 14) {
          this.httpService.get('medifirst2000/reservasionline/cek-pasien-baru-by-nik/' + nik).subscribe(e => {
            if (e.data.length > 0) {
              this.messageService.info('Info', 'Pasien ini adalah pasien lama dengan No RM ' + e.data[0].nocm)
              this.messageService.info('Info', 'Mohon daftar dengan Tipe Pasien Lama')
              return
            } else
              this.activeIndex = valueIndex
          })
        } else {
          this.activeIndex = valueIndex
        }



      }
      if (this.isLama) {
        if (!noCM) {
          this.messageService.warn('Peringatan', 'No RM harus di isi !')
          return
        }
        // if (!tglLahirLama) {
        //   this.messageService.warn('Peringatan', 'Tgl Lahir harus di isi !')
        //   return
        // }
        // var tgllahir = moment(tglLahirLama).format('DD/MM/YYYY')
        this.httpService.get('medifirst2000/reservasionline/get-pasien/' + noCM + '/' + tglLahirLama).subscribe(res => {
          if (res.data.length > 0) {
            if (noCM.length > 6) {
              this.formGroup.get('noCm').setValue(res.data[0].nocm)
            }
            this.formGroup.get('resumeNIK').setValue(res.data[0].noidentitas)
            this.formGroup.get('noTelpon').setValue(res.data[0].notelepon)
            this.formGroup.get('namaPasien').setValue(res.data[0].namapasien)
            let tglLhia = new Date(res.data[0].tgllahir)
            console.log(tglLhia)
            this.formGroup.get('tglLahirLama').setValue(moment(tglLhia).format('YYYY/MM/DD'))
            this.formGroup.get('jenisKelamin').setValue({ id: res.data[0].objectjeniskelaminfk, jeniskelamin: res.data[0].jeniskelamin })
            let namaPasien = res.data[0].namapasien
            let subStr = namaPasien.substring(0, 5)
            this.messageService.success('Sukses', 'Nama Pasien ' + subStr + '********')
            this.formGroup.get('agamaPasien').setValue({ id: res.data[0].objectagamafk, agama: res.data[0].agama })
            this.formGroup.get('statusPerkawinan').setValue({ id: res.data[0].objectstatusperkawinanfk, statusperkawinan: res.data[0].statusperkawinan })
            this.formGroup.get('golonganDarah').setValue({ id: res.data[0].objectgolongandarahfk, golongandarah: res.data[0].golongandarah })
            this.formGroup.get('pendidikan').setValue({ id: res.data[0].objectpendidikanfk, pendidikan: res.data[0].pendidikan })
            this.formGroup.get('pekerjaan').setValue({ id: res.data[0].objectpekerjaanfk, pekerjaan: res.data[0].pekerjaan })
            this.formGroup.get('hambatanKomunikasi').setValue({ id: res.data[0].hambatankomunikasifk, hambatankomunikasi: res.data[0].hambatankomunikasi })
            this.formGroup.get('nikPenanggungJawab').setValue(res.data[0].nik1)
            this.formGroup.get('namaPenanggungJawab').setValue(res.data[0].penanggungjawab)
            this.formGroup.get('alamatLengkapPenanggungJawab').setValue(res.data[0].alamatrmh)
            this.formGroup.get('nikPenanggungJawab').setValue(res.data[0].nik1)


            this.noBpjs = res.data[0].nobpjs
            this.noCmfk = res.data[0].nocmfk
            this.activeIndex = valueIndex
          }

          else
            this.messageService.error('Info', 'Data tidak ditemukan')

        }, error => {
          this.messageService.error('Info', 'Data tidak ditemukan')
        })


      }
    }
    if (valueIndex == 2) {
      // this.getMaxJamReservasi()
      let tglReservasi = this.formGroup.get('tglReservasi').value
      tglReservasi = new Date(tglReservasi._i.year, tglReservasi._i.month, tglReservasi._i.date)
      let poliKlinik = this.formGroup.get('poliKlinik').value
      let dokter = this.formGroup.get('dokter').value
      let tipePembayaran = this.formGroup.get('tipePembayaran').value
      let jamReservasi = this.formGroup.get('jamReservasi').value
      let noRujukan = this.formGroup.get('noRujukan').value
      let noKartuPeserta = this.formGroup.get('noKartuPeserta').value
      if (!tglReservasi) {
        this.messageService.warn('Peringatan', 'Tgl Reservasi harus di isi !')
        return
      }
      if (!poliKlinik) {
        this.messageService.warn('Peringatan', 'Poliklinik belum di pilih !')
        return
      }
      if (!jamReservasi) {
        this.messageService.warn('Peringatan', 'Jam Reservasi belum di pilih !')
        return
      }
      if (!dokter) {
        this.messageService.warn('Peringatan', 'Dokter belum di pilih !')
        return
      }
      if (!tipePembayaran) {
        this.messageService.warn('Peringatan', 'Tipe Pembayaran belum di pilih !')
        return
      }
      if (tipePembayaran.id == 2) {
        if (!noKartuPeserta) {
          this.messageService.warn('Peringatan', 'No Kartu Peserta belum di isi !')
          return
        }
        if (!noRujukan) {
          this.messageService.warn('Peringatan', 'No Rujukan belum di isi !')
          return
        }
      }

      let tgl = ''
      if (this.isBaru) {
        tgl = tglLahir
        this.formGroup.get('isBaru').setValue(true)
      }
      else {
        tgl = tglLahirLama
        this.formGroup.get('isBaru').setValue(false)
      }

      if (noCM != null && noCM.length > 7)
        this.formGroup.get('resumeNIK').setValue(noCM)
      else
        this.formGroup.get('resumeNoRM').setValue(noCM)
      let namaPasiensss = namaPasien
      let subStr = namaPasiensss.substring(0, 5)
      this.formGroup.get('resumeNamaDukcapil').setValue(subStr + ' *******')
      this.formGroup.get('resumeNama').setValue(namaPasien)
      this.formGroup.get('resumeTglLahir').setValue(moment(tgl).format('DD/MM/YYYY'))
      this.formGroup.get('resumeJK').setValue(jenisKelamin.jeniskelamin)
      this.formGroup.get('resumeNoTelp').setValue(noTelpon)

      this.formGroup.get('resumeTglReservasi').setValue(moment(tglReservasi).format('DD/MM/YYYY') + ' ' + jamReservasi.jam)
      this.formGroup.get('resumePoli').setValue(poliKlinik.namaruangan)
      this.formGroup.get('resumeDokter').setValue(dokter.namalengkap)
      // this.formGroup.get('resumeDokter').setValue('-')
      this.formGroup.get('resumeTipe').setValue(tipePembayaran.kelompokpasien)
      this.formGroup.get('resumNoka').setValue(this.formGroup.get('noKartuPeserta').value != null ? this.formGroup.get('noKartuPeserta').value : '')
      this.formGroup.get('resumNoRujukan').setValue(this.formGroup.get('noRujukan').value != null ? this.formGroup.get('noRujukan').value : '-')
      let tipePasiens = ''
      if (this.isBaru) {
        tipePasiens = 'baru'
      } else {
        tipePasiens = 'lama'
      }

      if (this.formGroup.get('tipePembayaran').value.id == 2) {
        if (this.formGroup.get('noKartuPeserta').value != null) {

          let prov = {
            "url": "Peserta/nokartu/" + this.formGroup.get('noKartuPeserta').value + "/tglSEP/" + moment(new Date()).format('YYYY-MM-DD'),
            "method": "GET",
            "data": null
          }
          this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", prov).subscribe(xx => {
            if (xx.metaData.code == '200') {
              if (this.formGroup.get('resumeNIK').value == null) {
                this.formGroup.get('resumeNIK').setValue(xx.response.peserta.nik)
              }
              this.formGroup.get('nik').setValue(xx.response.peserta.nik)
            }
          })
        }
        // cek pasien dihari yang sama hanya boleh satu kali daftar
        let tglLahirs = moment(new Date(this.formGroup.get('tglLahir').value)).format('YYYY/MM/DD')
        let cektglReservasi = moment(tglReservasi).format('YYYY/MM/DD')
        this.httpService.get('medifirst2000/reservasionline/cek-reservasi-satu?tglReservasi=' + cektglReservasi
          + '&tipePasien=' + tipePasiens
          + '&noCm=' + this.formGroup.get('noCm').value
          + '&tglLahir=' + tglLahirs
          + '&namaPasien=' + this.formGroup.get('namaPasien').value
          + '&ruanganId=' + poliKlinik.id
        ).subscribe(e => {
          if (e.data.length > 0) {
            this.messageService.warn('Perhatian', 'Pasien BPJS di Hari yang sama hanya dapat mendaftar Satu Kali')
            return
          } else {
            if (this.formGroup.get('noRujukan').value == null) {
              this.messageService.warn('Perhatian', 'No Rujukan harus di isi')
              return
            }
            this.onCariNoRujukan(this.formGroup.get('noKartuPeserta').value, valueIndex)
            // this.activeIndex = valueIndex
          }
        }, error => {
          this.activeIndex = valueIndex
        })

      } else {
        this.activeIndex = valueIndex
      }
      //end cek

    }
    if (valueIndex == 3) {
      this.listJam = []

      this.activeIndex = valueIndex
    }
  }
  onCariNoRujukan(searchValue: string, valueIndex): void {

    // this.activeIndex = valueIndex
    let prov = {
      "url": "Rujukan/Peserta/" + searchValue,
      "method": "GET",
      "data": null
    }

    this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", prov).subscribe(e => {
      // this.httpService.get('medifirst2000/bridging/bpjs/get-rujukan-pcare-nokartu?nokartu=' + searchValue).subscribe(e => {
      if (e.metaData.code == '200') {
        this.formGroup.get('noRujukan').setValue(e.response.rujukan.noKunjungan)
        this.formGroup.get('resumNoRujukan').setValue(this.formGroup.get('noRujukan').value != null ? this.formGroup.get('noRujukan').value : '-')

        this.messageService.info('No Rujukan Aktif',e.response.rujukan.noKunjungan)
        this.activeIndex = valueIndex
      } else {
        // this.messageService.error('Rujukan PCARE', e.metaData.message)
        let prov = {
          "url": "Rujukan/RS/Peserta/" + searchValue,
          "method": "GET",
          "data": null
        }
        this.httpService.postNonMessage("medifirst2000/bridging/bpjs/tools", prov).subscribe(e => {
          if (e.metaData.code == '200') {
            this.formGroup.get('noRujukan').setValue(e.response.rujukan.noKunjungan)
            this.formGroup.get('resumNoRujukan').setValue(this.formGroup.get('noRujukan').value != null ? this.formGroup.get('noRujukan').value : '-')
            this.messageService.info('No Rujukan Aktif',e.response.rujukan.noKunjungan)
            this.activeIndex = valueIndex
          } else {
             this.messageService.error('Rujukan', e.metaData.message)
             this.activeIndex = valueIndex
          }
        }, error => {
          this.messageService.error('Peringatan', 'Rujukan Tidak Ada atau Masa Berlaku habis')

        })
      }
    }, error => {
      // this.statusRujukanBerlaku = false
      this.messageService.error('Peringatan', 'Rujukan Tidak Ada atau Masa Berlaku habis')

    })

  }
  cekPasienMendaftarDihariSama(tglReser, tipePasien) {
    let tglLahir = moment(new Date(this.formGroup.get('tglLahir').value)).format('YYYY/MM/DD')
    tglReser = moment(tglReser).format('YYYY/MM/DD')
    this.httpService.get('medifirst2000/reservasionline/cek-reservasi-satu?tglReservasi=' + tglReser
      + '&tipePasien=' + tipePasien
      + '&noCm=' + this.formGroup.get('noCm').value
      + '&tglLahir=' + tglLahir
      + '&namaPasien=' + this.formGroup.get('namaPasien').value).subscribe(e => {

      }, error => {

      })
  }

  setSourceCombo() {


    // this.filteredOptions = this.formGroup.get('dokter').valueChanges
    // .pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );

  }


  sendNotification(e) {
    var body = {
        norec: e.norec,
        judul: 'Reservasi Baru dari ' + e.namapasien,
        jenis: 'Reservasi Baru',
        pesanNotifikasi: '',
        idRuanganAsal: null,
        idRuanganTujuan: 110,
        ruanganAsal: null,
        ruanganTujuan: 'Bag. Informasi & Rekam Medik',
        kelompokUser: null, //medifirstService.getKelompokUser()
        idKelompokUser: null,
        // idPegawai: medifirstService.getPegawai().id,
        dataArray: [],
        urlForm: 'RGFmdGFyUGFzaWVuUGVyamFuamlhbg==',
        params: {
            noOrder: e.noreservasi
        },
        namaFungsiFrontEnd: null,
        tgl: this.formGroup.get('tglReservasi').value,
        tgl_string: this.formGroup.get('tglReservasi').value,
    }
    console.log(body);
    this.sendSocket("sendNotification", body);
  }
  sendSocket (name, body) {
    console.log(this.socket);

    this.socket.emit('get-server-socket', {
        "name": name,
        "body": body
    });
  }
  save() {
      // return
    if (this.isBaru) {
      this.formGroup.get('tglLahir').setValue(moment(this.formGroup.get('tglLahir').value).format('YYYY/MM/DD'))
    } else {
      this.formGroup.get('tglLahir').setValue(moment(this.formGroup.get('tglLahirLama').value).format('YYYY/MM/DD'))
    }
    let tglReservasi = this.formGroup.get('tglReservasi').value
    tglReservasi = new Date(tglReservasi._i.year, tglReservasi._i.month, tglReservasi._i.date)
    var tanggal: any = moment(tglReservasi).format('YYYY/MM/DD') + ' ' + this.formGroup.get('jamReservasi').value.jam
    console.log(this.formGroup)
    this.formGroup.get('tglReservasiFix').setValue(tanggal)

    this.formGroup.get('dokter').setValue({ id: this.formGroup.get('dokter').value.id, namalengkap: this.formGroup.get('dokter').value.namalengkap })
    // this.formGroup.get('dokter').setValue(null)
    this.confirmationService.confirm({
      message: 'Yakin mau menyimpan data?',
      accept: async () => {
        this.simpanVisible = false
        if(this.noCmfk) {
          if (this.formGroup.get('tipePembayaran').value.id == 2) {
            let cekDaftar30hr = await this.httpService.get(`medifirst2000/registrasi/cek-pasien-bpjs-daftar-30hari?nocm=${this.noCmfk}&tglperiksa=${moment(this.formGroup.get('tglReservasi').value).format('YYYY-MM-DD')}`).toPromise()
            if(cekDaftar30hr.status) {
              this.messageService.info('Info', 'Pendaftaran Anda ditunda karena pendaftaran sebelumnya kurang dari 30 hari')
              return;
            }
          }
        }
        this.httpService.post('medifirst2000/reservasionline/save', this.formGroup.value).subscribe(res => {
          var resultNoReservasi = res.data
          console.log(res);
        this.sendNotification(res.data)

          if (this.isBaru) {
            this.formHistory.get('noCm').setValue(this.formGroup.get('namaPasien').value)
          } else {
            this.formHistory.get('noCm').setValue(this.formGroup.get('noCm').value)
          }
          this.formHistory.get('tglLahir').setValue(this.formGroup.get('tglLahir').value)
          let tglLahirLama = moment(this.formHistory.get('tglLahir').value).format('DD-MM-YYYY')
          this.httpService.get('medifirst2000/reservasionline/get-history?nocmNama=' + this.formHistory.get('noCm').value + '&tgllahir='
            + tglLahirLama).subscribe(res => {
              let dataReserv = {}
              this.loadingHistory = false
              if (res.data.length > 0) {
                this.isCollalsedPasien = false
                for (let i = 0; i < res.data.length; i++) {
                  const element = res.data[i];
                  let tglReserDay = new Date(element.tanggalreservasi)
                  let _hari = tglReserDay.getDay();
                  let hariFix = this.listHari[_hari]
                  element.tanggalreservasi = hariFix + ', ' + moment(new Date(element.tanggalreservasi)).format('DD/MMM/YYYY HH:mm') //HH:mm
                  // element.tanggalreservasi = moment(new Date(element.tanggalreservasi)).format('DD/MMM/YYYY HH:mm')
                }
                let tglReserDays = new Date(resultNoReservasi.tanggalreservasi)
                let _haris = tglReserDays.getDay();
                let hariFix = this.listHari[_haris]
                resultNoReservasi.tanggalreservasi = hariFix + ', ' + moment(new Date(resultNoReservasi.tanggalreservasi)).format('DD/MMM/YYYY HH:mm') //HH:mm
                resultNoReservasi.tanggal = hariFix + ', ' + moment(new Date(resultNoReservasi.tanggal)).format('DD/MMM/YYYY') //HH:mm
                let namaPasien = res.data[0].namapasien
                let subStr = namaPasien.substring(0, 5)

                this.formHistory.get('namaPasien').setValue(subStr + '********')
                this.formHistory.get('jenisKelamin').setValue(res.data[0].jeniskelamin)
                let notelp = ''
                if (res.data[0].notelepon == null)
                  res.data[0].notelepon = ''
                if (res.data[0].nohp == null)
                  res.data[0].nohp = ''
                notelp = res.data[0].notelepon + ' - ' + res.data[0].nohp

                this.formHistory.get('tempatLahir').setValue(res.data[0].tempatlahir)
                this.formHistory.get('noTelpon').setValue(notelp)
                // this.formHistory.get('noBPJS').setValue(res.data[0].nobpjs != null ? res.data[0].nobpjs : '-')
                this.formHistory.get('noAsuransi').setValue(res.data[0].nobpjs != null ? res.data[0].nobpjs : '-' +
                  ' / ' + res.data[0].noasuransilain != null ? res.data[0].noasuransilain : '-')
                this.formHistory.get('alamat').setValue(res.data[0].alamatlengkap)
                this.formHistory.get('pekerjaan').setValue(res.data[0].pekerjaan)
                this.formHistory.get('pendidikan').setValue(res.data[0].pendidikan)
                this.dataSource = res.data

                this.formGroup.reset()
              } else {
                this.dataSource = []
                this.isCollalsedPasien = true
                // this.messageService.info('Info', 'Data tidak ada')
              }
              this.activeItem = {
                icon: "fa fa-fw fa-history",
                label: "History"
              }

              this.cetakHistory(resultNoReservasi)
              this.simpanVisible = true
            }, error => {
              this.isCollalsedPasien = true
              this.dataSource = []
              this.loadingHistory = false
              this.simpanVisible = true
              // this.messageService.info('Info', 'Data tidak ada')
            })


          // this.formGroup.reset()

        }, error => {
          this.simpanVisible = true
        })
      }
    })
  }
  popUpQR() {
    this.displayPopUpQr = true
  }
  getSlotTgl(event) {
    this.formGroup.get('jamReservasi').reset()
    this.formGroup.get('poliKlinik').reset()
    this.formGroup.get('dokter').reset()
  }
  getSlotRu(event) {
    this.listDokter = []
    this.formGroup.get('jamReservasi').reset()
    this.formGroup.get('dokter').setValue('')
    this.formGroup.get('dokter').reset()

    this.getListDokter()
  }
  getSlotDok(event) {
    this.formGroup.get('jamReservasi').reset()
    this.getSlotting()
  }
  getListDokter() {
    this.listDokter = []
    if (this.formGroup.get('poliKlinik').value == null || this.formGroup.get('poliKlinik').value == '') return
    if (this.formGroup.get('tglReservasi').value == null || this.formGroup.get('tglReservasi').value == '') return
    this.httpService.get('medifirst2000/reservasionline/get-dokter?id_ruangan=' + this.formGroup.get('poliKlinik').value.id
      + '&tgl=' + moment(this.formGroup.get('tglReservasi').value).format('YYYY-MM-DD')).subscribe(e => {
        if(e.list.length == 0){
          this.messageService.warn('Maaf', e.message)
          return
        }else{
          this.messageService.info('Info', e.list.length+ ' Dokter tersedia di Poli ini')
          this.listDokter = e.list
        }
        console.log(this.formGroup.get('poliKlinik'));

        if(this.formGroup.get('poliKlinik').value.id == 791 ||this.formGroup.get('poliKlinik').value.id == 767
        ||this.formGroup.get('poliKlinik').value.id == 807
        ){
          this.listTipePembayaran = []
          this.listTipePembayaran.push({
            id:1,
            kelompokpasien: "Umum/Pribadi"
          })
        }else{
          this.listTipePembayaran = []
          this.httpService.get('medifirst2000/reservasionline/get-list-data').subscribe(e => {
            e.kelompokpasien.forEach(element => {
              this.listTipePembayaran.push(element)
            });
          })
        }
      })
  }
  setJam(e){
    this.messageService.info('Info', 'Sisa Kuota ' + e.value.sisaquota )
  }
  getSlotting() {
    this.formGroup.get('jamReservasi').reset()
    this.listJam = []
    let idRuangan = null
    let tglReservasi = null
    let dokter = null
    if (this.formGroup.get('poliKlinik').value == null || this.formGroup.get('poliKlinik').value == '') return
    idRuangan = this.formGroup.get('poliKlinik').value.id
    if (this.formGroup.get('dokter').value == null || this.formGroup.get('dokter').value == '') return
    dokter = this.formGroup.get('dokter').value.id
    if (this.formGroup.get('tglReservasi').value == null || this.formGroup.get('tglReservasi').value == '') return
    tglReservasi = moment(this.formGroup.get('tglReservasi').value).format('YYYY-MM-DD')


    this.httpService.get('medifirst2000/reservasionline/get-slotting-rev?id_ruangan='
      + idRuangan + '&id_dokter=' + dokter
      + '&tgl=' + tglReservasi).subscribe(res => {
        if(res.status != 200){
          this.messageService.warn('Maaf', res.message)
          return
        }
        let now = moment(new Date()).format('YYYY/MM/DD')
        let tglNow = new Date(now + ' ' + '13:00')
        if (this.maxJamReservasi != undefined) {
          tglNow = new Date(now + ' ' + this.maxJamReservasi)
        }

        let tglNowNol = new Date(now + ' ' + '00:00')
        let tglPesen = this.formGroup.get('tglReservasi').value
        tglPesen = new Date(tglPesen._i.year, tglPesen._i.month, tglPesen._i.date)

        let tglPesenNol = new Date(moment(tglPesen).format('YYYY/MM/DD 00:00'))
        let tglRes = tglPesen
        let yesterday = new Date(tglRes.setDate(tglRes.getDate() - 1))
        let tglReservasis = moment(tglPesen).format('YYYY/MM/DD')
        // if (new Date() > tglNow && new Date() < new Date(tglReservasis)) {
        if (new Date() > tglNow && new Date() > tglPesen) {
          if (this.maxJamReservasi != undefined) {
            this.messageService.error('Maaf', 'Jadwal Reservasi untuk besok maksimal dipesan sebelum jam ' + this.maxJamReservasi + ', Coba reservasi dihari diberikutnya')
            return
          }
          this.messageService.error('Maaf', 'Jadwal Reservasi untuk besok maksimal dipesan sebelum jam 13:00, Coba reservasi dihari diberikutnya')
          return
        }
        if (tglNowNol == tglPesenNol) {
          this.messageService.error('Maaf', 'Tidak Bisa Pesan Untuk Tanggal Sekarang')
          return
        }
        // let jamBuka = res.tanggal + ' ' + res.slot.jambuka
        // let jamTutup = res.tanggal + ' ' + res.slot.jamtutup
        // let interval = res.slot.interval
        // let quota = res.slot.quota
        this.listJam = res.listjam;

        if (this.listJam.length == 0)
          this.messageService.error('Maaf', 'Jadwal Reservasi Sudah Penuh, Coba dihari lain')
        else
          this.messageService.info('Info', 'Slot Reservasi Tersedia : ' + this.listJam.length + ' jadwal')

      }, error => {
        this.listJam = []
        this.messageService.error('Maaf', 'Jadwal Reservasi Sudah Penuh, Coba dihari lain')
      })

  }
  intervals(startString, endString, interval) {
    var start = moment(startString, 'YYYY/MM/DD HH:mm');
    var end = moment(endString, 'YYYY/MM/DD HH:mm');

    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    start.minutes(Math.ceil(start.minutes() / 15) * 15);

    var result = [];

    var current = moment(start);

    while (current <= end) {
      result.push(current.format('YYYY/MM/DD HH:mm'));
      current.add(interval, 'minutes');
    }

    return result;
  }
  getDaftarSlot() {

    let tglAwal = moment(this.formGroup.get('tglAwal').value).format('YYYY/MM/DD')
    let tglAkhir = moment(this.formGroup.get('tglAkhir').value).format('YYYY/MM/DD')

    this.httpService.get('medifirst2000/reservasionline/get-slot-available?tglAwal=' + tglAwal
      + '&tglAkhir=' + tglAkhir).subscribe(res => {
        let jamBuka = res.tanggal + ' ' + res.slot.jambuka
        let jamTutup = res.tanggal + ' ' + res.slot.jamtutup
        let interval = res.slot.interval
        let quota = res.slot.quota
        this.listJam = [];
        let result = [];
        result = this.intervals(jamBuka, jamTutup, interval)

        if (result.length > 0) {
          for (let i = 0; i < quota; i++) {
            this.listJam.push({
              'jam': moment(new Date(result[i])).format('HH:mm')
            })
          }
        }
        let listReservasi = []
        if (res.reservasi.length > 0) {
          listReservasi = res.reservasi
        }

        if (listReservasi.length > 0) {
          for (let j = 0; j < listReservasi.length; j++) {
            for (let i = 0; i < this.listJam.length; i++) {
              if (this.listJam[i].jam == listReservasi[j].jamreservasi) {
                // this.listJam.splice[i]
                this.listJam.splice([i], 1)
                // this.listJam[i].disable = false
              }
            }
          }
        }
        if (this.listJam.length == 0)
          this.messageService.error('Maaf', 'Jadwal Reservasi Sudah Penuh, Coba dihari lain')
      }, error => {
        this.listJam = []
        this.messageService.error('Maaf', 'Jadwal Reservasi Sudah Penuh, Coba dihari lain')
      })

  }
  findPelayanan() {
    if (!this.formPelayanan.get('noRegistrasi').value) {
      this.messageService.warn('Warn', 'No Registrasi harus di isi')
      return
    }
    this.deposit = 0
    this.totalBayar = 0
    this.sisaTagihan = 0
    this.totalKlaim = 0
    this.totalTagihan = 0
    this.item = {}

    this.httpService.get('medifirst2000/reservasionline/tagihan/get-pasien/' + this.formPelayanan.get('noRegistrasi').value).subscribe(res => {
      // this.httpService.get('medifirst2000/reservasionline/get-data-pelayanan/' + this.formPelayanan.get('noRegistrasi').value).subscribe(e => {
      let e = res.data
      this.item.noRegistrasi = e.noregistrasi
      this.item.noCm = e.nocm
      this.item.namaPasien = e.namapasien.toUpperCase()
      this.item.ruangan = e.namaruangan
      this.item.kelasRawat = e.namakelas

      if (e.kelompokpasien.indexOf('BPJS') > -1)
        this.titleKlaim = 'Tanggungan BPJS/INA-CBGs'
      else
        this.titleKlaim = 'Total Klaim'
      let tglReg = new Date(e.tglregistrasi)
      let _hari = tglReg.getDay();
      let hariFix = this.listHari[_hari]
      e.tglregistrasi = hariFix + ', ' + moment(new Date(e.tglregistrasi)).format('DD/MMM/YYYY HH:mm') //HH:mm
      this.item.tglRegistrasi = e.tglregistrasi
      if (e.tglpulang == null) {
        e.tglpulang = '-'
      } else {
        let tglPlg = new Date(e.tglpulang)
        let _haris = tglPlg.getDay();
        let hariFixx = this.listHari[_haris]
        e.tglpulang = hariFixx + ', ' + moment(new Date(e.tglpulang)).format('DD/MMM/YYYY HH:mm') //HH:mm
      }

      this.item.tglPulang = e.tglpulang
      this.item.jenisPasien = e.kelompokpasien
      // if (e.jumlahBayar == null)
      //   e.jumlahBayar = 0
      // if (e.deposit == null)
      //   e.deposit = 0
      // if (e.billing == null)
      //   e.billing = 0
      // this.deposit = this.formatRupiah(e.deposit, 'Rp. ');
      // this.totalBayar = this.formatRupiah(e.jumlahBayar, 'Rp. ');

      // let sisa = parseFloat(e.billing) - e.jumlahBayar - parseFloat(e.deposit)
      // this.sisaTagihan = this.formatRupiah(sisa, 'Rp. ');
      // this.httpService.get('valet/terbilang/' + sisa).subscribe(res => {
      //   this.totalTerbilang = res.terbilang.toUpperCase()
      // })
    }, error => {
      // this.deposit = 0
      // this.totalBayar = 0
      // this.sisaTagihan = 0
      this.item = {}
    })
    this.dataSourceRincian = []
    this.httpService.get('medifirst2000/reservasionline/get-tagihan-pasien/' + this.formPelayanan.get('noRegistrasi').value).subscribe(e => {
      this.totalKlaim = e.totalklaim
      this.deposit = e.deposit
      this.totalBayar = 0
      for (let i = 0; i < e.details.length; i++) {
        // if (e.details[i].sbmfk != null)
        //   this.totalBayar = this.totalBayar + e.details[i].total
        if (e.details[i].strukresepfk != null) {
          e.details[i].ruanganTindakan = 'Pemakaian Obat & Alkes ' + e.details[i].ruanganTindakan
        }
      }
      let sama = false
      let arrGroup = [];
      for (let i = 0; i < e.details.length; i++) {
        sama = false
        for (let x = 0; x < arrGroup.length; x++) {
          if (arrGroup[x].ruanganTindakan == e.details[i].ruanganTindakan) {
            arrGroup[x].total = parseFloat(arrGroup[x].total) + parseFloat(e.details[i].total)
            sama = true;
          }
        }
        if (sama == false) {
          let result = {
            ruanganTindakan: e.details[i].ruanganTindakan,
            total: e.details[i].total,

          }
          arrGroup.push(result)
        }
      }
      let totals = 0
      this.totalTagihan = 0
      for (let i = 0; i < arrGroup.length; i++) {
        const element = arrGroup[i];
        totals = element.total + totals
        this.totalTagihan = element.total + this.totalTagihan
        element.total = this.formatRupiah(element.total, 'Rp. ');
      }
      this.totalBayar = e.bayar
      // this.totalBayar = parseFloat(this.totalTagihan) - parseFloat(this.deposit)
      this.sisaTagihan = parseFloat(this.totalTagihan) - this.totalBayar - parseFloat(this.deposit) - this.totalKlaim

      this.httpService.get('medifirst2000/sysadmin/general/get-terbilang/' + this.sisaTagihan).subscribe(res => {
        this.totalTerbilang = res.terbilang.toUpperCase()
      })
      this.totalTagihan = this.formatRupiah(this.totalTagihan, 'Rp. ');
      this.deposit = this.formatRupiah(this.deposit, 'Rp. ');
      this.totalBayar = this.formatRupiah(this.totalBayar, 'Rp. ');
      this.sisaTagihan = this.formatRupiah(this.sisaTagihan, 'Rp. ');
      this.totalKlaim = this.formatRupiah(this.totalKlaim, 'Rp. ');
      arrGroup.sort(this.compare);
      this.dataSourceRincian = arrGroup


      this.isShowRincian = false
      // this.updateRowGroupMetaData();
    }, error => {
      this.isShowRincian = true
      this.dataSourceRincian = []
      this.totalTerbilang = '-'
      this.deposit = 0
      this.totalBayar = 0
      this.sisaTagihan = 0
      this.messageService.info('Info', 'Data Tidak ditemukan')
    })
  }
  compare(a, b) {
    if (a.ruanganTindakan < b.ruanganTindakan) {
      return -1;
    }
    if (a.ruanganTindakan > b.ruanganTindakan) {
      return 1;
    }
    return 0;
  }


  formatRupiah(value, currency) {
    return currency + "" + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.dataSourceRincian) {
      for (let i = 0; i < this.dataSourceRincian.length; i++) {
        let rowData = this.dataSourceRincian[i];
        let ruanganTindakan = rowData.ruanganTindakan;
        if (i == 0) {
          this.rowGroupMetadata[ruanganTindakan] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.dataSourceRincian[i - 1];
          let previousRowGroup = previousRowData.brand;
          if (ruanganTindakan === previousRowGroup)
            this.rowGroupMetadata[ruanganTindakan].size++;
          else
            this.rowGroupMetadata[ruanganTindakan] = { index: i, size: 1 };
        }
      }
    }
  }
  // getMaxJamReservasis() {
  //   let maxJam = 'maxJamReservasi'
  //   this.httpService.get('medifirst2000/reservasionline/get-setting?namaField=' + maxJam)
  //     .subscribe(response => {
  //       this.maxJamReservasi = response
  //       console.log(response)
  //     }, error => {

  //     })
  // }
  pilihNoregis(event) {
    this.selectedItemGridRiwayat = event
    this.formPelayanan.get('noRegistrasi').setValue(event.noregistrasi)
    this.isShowRiwayatRegis = false
    this.findPelayanan()
    this.dataSourceRm = []
  }
  tutupPopUpRm() {
    this.isShowRiwayatRegis = false

  }
  findRiwayatRegis() {
    if (!this.formPelayanan.get('noRm').value) {
      this.messageService.warn('Info', 'Masukan No Rekam Medis')
      return
    }
    this.dataSourceRm = []

    this.httpService.get('medifirst2000/reservasionline/daftar-riwayat-registrasi?norm=' + this.formPelayanan.get('noRm').value)
      .subscribe(response => {
        for (let i = 0; i < response.daftar.length; i++) {
          const element = response.daftar[i];
          element.tglregistrasi = moment(new Date(element.tglregistrasi)).format('YYYY/MM/DD')
        }
        let datas = []
        if (response.daftar.length > 0) {
          datas = response.daftar
          datas.sort(this.compareRiwaayat)
        }
        this.dataSourceRm = datas
      }, error => {
        this.dataSourceRm = []
      })

  }
  compareRiwaayat(a, b) {
    if (a.tglregistrasi > b.tglregistrasi) {
      return -1;
    }
    if (a.tglregistrasi < b.tglregistrasi) {
      return 1;
    }
    return 0;
  }
  // copyNorek() {
  //   if (this.selectedNorek == undefined) {
  //     this.messageService.warn('Peringatan', 'Pilih data dulu')
  //     return
  //   }
  //   let selec = this.selectedNorek.bankaccountnomor
  //   selec.select()
  //   document.execCommand('copy');
  //   alert("Copied the text: " + selec.value);
  // }
  // copyInputMessage(inputElement) {
  //   inputElement.select();
  //   document.execCommand('copy');
  //   inputElement.setSelectionRange(0, 0);
  // }
  onRowSelectNoRek(event) {
    this.selectedNorek = event.data
  }
  clickPanduan() {
    this.isPanduanReservasi = !this.isPanduanReservasi
  }


}
export interface ImageViewerConfig {
  btnClass?: string;
  zoomFactor?: number;
  containerBackgroundColor?: string;
  wheelZoom?: boolean;
  allowFullscreen?: boolean;
  allowKeyboardNavigation?: boolean;

  btnShow?: {
    zoomIn?: boolean;
    zoomOut?: boolean;
    rotateClockwise?: boolean;
    rotateCounterClockwise?: boolean;
    next?: boolean;
    prev?: boolean;
  };

  btnIcons?: {
    zoomIn?: string;
    zoomOut?: string;
    rotateClockwise?: string;
    rotateCounterClockwise?: string;
    next?: string;
    prev?: string;
    fullscreen?: string;
  };

  customBtns?: Array<
    {
      name: string;
      icon: string;
    }
  >;
}

export class CustomEvent {
  name: string;
  imageIndex: number;

  constructor(name, imageIndex) {
    this.name = name;
    this.imageIndex = imageIndex;
  }
}
