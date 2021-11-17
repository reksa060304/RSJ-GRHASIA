import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AuthenticationService } from 'app/auth/service';
import { DatatablesService } from 'app/main/tables/datatables/datatables.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CacheService } from '../cache.service';
import { HttpService } from '../httpService';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BillingComponent implements OnInit {
  // public
  public contentHeader: object;
  item: any = {}
  va: any = {}
  selectVA_Img: any
  public selected = []
  public isCollapsed1 = false;
  public isCollapsed2 = true;
  public isCollapsed3 = true
  dsTagihan = []
  public rows: any;
  public exportCSVData;
  public _unsubscribeAll;
  public basicSelectedOption: number = 10;
  public basicSelectedOption2: number = 10;
  private tempData = [];
  private tempData2 = []
  public ColumnMode = ColumnMode;
  apiTimer: any
  selectVA_BANK: any
  billing: any = {}
  isBayar: boolean
  isLoading: boolean
  upgradeTime = 7200;
  seconds = this.upgradeTime
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild(DatatableComponent) table2: DatatableComponent;
  public kitchenSinkRows: any;
  public dataSourceRincian = []
  listHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  public SelectionType = SelectionType;
  listVA = [
    { id: 'briva', name: "BRI (BRIVA)", img: 'https://s1.bukalapak.com/tuku/assets/images/faca8cdb7b6b457ad4a817dcc892bc80.png' },
    { id: 'bank_bni', name: "BNI", img: 'https://s1.bukalapak.com/tuku/assets/images/35594f7d930540063eddce789ae99342.png' },
    // { id: 'bank_bca', name: "BCA", img: 'https://s1.bukalapak.com/tuku/assets/images/b6df8590cc3aad5b07d7a2685ea21612.png' },
    // { id: 'bank_mandiri', name: "Bank Mandiri", img: 'https://s1.bukalapak.com/tuku/assets/images/c3b0ad0918c4005eedec47bd8f6ed015.png' },

    // { id: 'bank_permata', name: "Permata", img: 'https://s1.bukalapak.com/tuku/assets/images/a09dfaad2fd8c149cd5b648e43e58e77.png' },
    // { id: 'bank_danamon', name: "Danamon", img: 'https://s1.bukalapak.com/tuku/assets/images/cd4ddae1a50446d6c074da829971d107.png' },
    // { id: 'bank_cimb', name: "CIMB", img: 'https://s1.bukalapak.com/tuku/assets/images/abf93de92ed80f4955cd9ade45c098f0.png' },
    // { id: 'bank_btn', name: "Bank BTN", img: 'https://s1.bukalapak.com/tuku/assets/images/8dd8e71fc157a99bb05971437ee0e649.png' },
    { id: 'bank_ocbc_nisp', name: "Bank OCBC NISP", img: 'https://s1.bukalapak.com/tuku/assets/images/ec16b577ee608b9424e977c4e6fbff48.png' },
    // { id: 'bank_bsi', name: "Bank Syariah Indonesia", img: 'https://s1.bukalapak.com/tuku/assets/images/596ae1103d8582788b5fd0e9b31ef4db.png' }
  ]
  titleKlaim: any = '-'
  constructor(private httpservice: HttpService,
    private cacheHelper: CacheService,
    private alertService: ToastrService,
    private _authenticationService: AuthenticationService,
    private _datatablesService: DatatablesService,
    private router: Router,
  ) {
    if (this._authenticationService.currentUserValue.pasien != null) {
      this.item = this._authenticationService.currentUserValue.pasien
      this.item.email = this._authenticationService.currentUserValue.login.email
    }
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.contentHeader = {
      headerTitle: 'Billing',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },

          {
            name: 'Billing',
            isLink: false
          }
        ]
      }
    };
    // this._datatablesService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.rows = response;

    //   this.tempData = this.rows;
    //   this.kitchenSinkRows = this.rows;
    //   this.exportCSVData = this.rows;
    // });
    this.findRiwayatRegis()
  }
  selectedVA(items) {
    this.selectVA_BANK = items.name
    this.selectVA_Img = items.img
  }
  findRiwayatRegis() {
    if (!this.item.nocm) {
      this.alertService.warning('', 'Anda Belum terdaftar sebagai pasien Rumah Sakit', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    this.kitchenSinkRows = []
    this.httpservice.get('medifirst2000/reservasionline/daftar-riwayat-registrasi?norm=' + this.item.nocm)
      .subscribe(response => {

        for (let i = 0; i < response.daftar.length; i++) {
          const element = response.daftar[i];
          element.no = i + 1
          element.tglregistrasi = moment(new Date(element.tglregistrasi)).format('YYYY-MM-DD')
          if (element.tglpulang != null)
            element.tglpulang = moment(new Date(element.tglpulang)).format('YYYY-MM-DD')
        }
        this.rows = response.daftar;

        this.tempData = this.rows;

        this.kitchenSinkRows = this.rows;
      }, error => {
        this.kitchenSinkRows = []
      })

  }
  onSelect({ selected }) {
    // console.log('Select Event', selected, this.selected);

    // this.selected.splice(0, this.selected.length);
    // this.selected.push(selected);
  }
  onSelect2({ selected }) {
    // console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(selected);
    this.billing.totalVA = 0
    this.billing.totalVARp = 0
    if (this.selected.length > 0)
      for (let x = 0; x < this.selected[0].length; x++) {
        const element = this.selected[0][x];
        this.billing.totalVA = this.billing.totalVA + parseFloat(element.total)

      }
    this.billing.totalVARp = this.formatRupiah(this.billing.totalVA, 'Rp. ')
    this.billing.keteranganVA = 'Pembayaran Tagihan Pasien'
  }
  /**
   * Search (filter)
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.namaruangan.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.kitchenSinkRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  filterUpdate2(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData2.filter(function (d) {
      return d.namaLayanan.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.dataSourceRincian = temp;
    // Whenever the filter changes, always go back to the first page
    this.table2.offset = 0;
  }
  /**
 * For ref only, log activate events
 *
 * @param selected
 */
  onActivate(event) {
    // console.log('Activate Event', event);
  }
  onActivate2(event) {
    // console.log('Activate Event', event);
  }
  selectBtn(select) {
    this.billing.noregistrasi = select.noregistrasi;
    this.billing.norecPd = select.norec;
    this.findPelayanan()
  }
  findPelayanan() {
    if (!this.billing.noregistrasi) return
    this.isCollapsed2 = true
    this.isCollapsed1 = false
    this.isCollapsed3 = true
    this.billing.deposit = 0
    this.billing.totalBayar = 0
    this.billing.sisaTagihan = 0
    this.billing.totalKlaim = 0
    this.billing.totalTagihan = 0


    this.httpservice.get('medifirst2000/reservasionline/tagihan/get-pasien/' + this.billing.noregistrasi).subscribe(res => {
      this.isCollapsed2 = false
      this.isCollapsed3 = true
      this.isCollapsed1 = true
      let e = res.data
      this.billing.noRegistrasi = e.noregistrasi
      this.billing.noCm = e.nocm
      this.billing.namaPasien = e.namapasien.toUpperCase()
      this.billing.ruangan = e.namaruangan
      this.billing.kelasRawat = e.namakelas

      if (e.kelompokpasien.indexOf('BPJS') > -1)
        this.titleKlaim = 'Tanggungan BPJS/INA-CBGs'
      else
        this.titleKlaim = 'Total Klaim'
      let tglReg = new Date(e.tglregistrasi)
      let _hari = tglReg.getDay();
      let hariFix = this.listHari[_hari]
      e.tglregistrasi = hariFix + ', ' + moment(new Date(e.tglregistrasi)).format('DD-MMM-YYYY HH:mm') //HH:mm
      this.billing.tglRegistrasi = e.tglregistrasi
      if (e.tglpulang == null) {
        e.tglpulang = '-'
      } else {
        let tglPlg = new Date(e.tglpulang)
        let _haris = tglPlg.getDay();
        let hariFixx = this.listHari[_haris]
        e.tglpulang = hariFixx + ', ' + moment(new Date(e.tglpulang)).format('DD-MMM-YYYY HH:mm') //HH:mm
      }

      this.billing.tglPulang = e.tglpulang
      this.billing.jenisPasien = e.kelompokpasien

    }, error => {
      this.billing = {}
    })
    this.dataSourceRincian = []
    this.httpservice.get('medifirst2000/reservasionline/get-tagihan-pasien/' + this.billing.noregistrasi).subscribe(e => {
      this.billing.totalKlaim = e.totalklaim
      this.billing.deposit = e.deposit
      this.billing.totalBayar = 0

      this.billing.totalTagihan = 0
      for (let i = 0; i < e.details.length; i++) {
        const element = e.details[i]
        // if (e.details[i].sbmfk != null)
        //   this.totalBayar = this.totalBayar + e.details[i].total
        element.no = i + 1
        element.totalRp = this.formatRupiah(element.total, 'Rp. ');
        this.billing.totalTagihan = this.billing.totalTagihan + parseFloat(element.total)
        if (element.strukresepfk != null) {
          element.ruanganTindakan = 'Pemakaian Obat & Alkes ' + e.details[i].ruanganTindakan
        }
      }
      // let sama = false
      // let arrGroup = [];
      // for (let i = 0; i < e.details.length; i++) {
      //   sama = false
      //   for (let x = 0; x < arrGroup.length; x++) {
      //     if (arrGroup[x].ruanganTindakan == e.details[i].ruanganTindakan) {
      //       arrGroup[x].total = parseFloat(arrGroup[x].total) + parseFloat(e.details[i].total)
      //       sama = true;
      //     }
      //   }
      //   if (sama == false) {
      //     let result = {
      //       ruanganTindakan: e.details[i].ruanganTindakan,
      //       total: e.details[i].total,
      //     }
      //     arrGroup.push(result)
      //   }
      // }
      // let totals = 0
      // this.billing.totalTagihan = 0
      // for (let i = 0; i < arrGroup.length; i++) {
      //   const element = arrGroup[i];
      //   element.no = i + 1
      //   totals = element.total + totals
      // this.billing.totalTagihan = element.total + this.billing.totalTagihan
      // element.total = this.formatRupiah(element.total, 'Rp. ');
      // }
      this.billing.totalBayar = e.bayar
      this.billing.sisaTagihan = parseFloat(this.billing.totalTagihan) -
        this.billing.totalBayar - parseFloat(this.billing.deposit) - this.billing.totalKlaim

      this.httpservice.get('medifirst2000/sysadmin/general/get-terbilang/' + this.billing.sisaTagihan).subscribe(res => {
        this.billing.totalTerbilang = res.terbilang.toUpperCase()
      })
      this.billing.totalTagihan = this.formatRupiah(this.billing.totalTagihan, 'Rp. ');
      this.billing.deposit = this.formatRupiah(this.billing.deposit, 'Rp. ');
      this.billing.totalBayar = this.formatRupiah(this.billing.totalBayar, 'Rp. ');
      this.billing.sisaTagihan = this.formatRupiah(this.billing.sisaTagihan, 'Rp. ');
      this.billing.totalKlaim = this.formatRupiah(this.billing.totalKlaim, 'Rp. ');
      // arrGroup.sort(this.compare);
      this.dataSourceRincian = e.details;// arrGroup

    }, error => {
      this.isCollapsed2 = true
      this.isCollapsed1 = false
      this.dataSourceRincian = []
      this.billing.totalTerbilang = '-'
      this.billing.deposit = 0
      this.billing.totalBayar = 0
      this.billing.sisaTagihan = 0
      this.alertService.info('', 'Data Tidak ditemukan', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });

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
  closeBil() {
    this.isCollapsed2 = true
    this.isCollapsed1 = false
    this.isCollapsed3 = true
  }
  bayarVA() {
    if (this.billing.sisaTagihan == 0) {
      this.alertService.info('', 'Sudah Lunas', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (this.billing.tglPulang == '-') {
      this.alertService.info('', 'Pasien belum Verifikasi Pihak RS', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (this.billing.jenisPasien != 'Umum/Pribadi') {
      this.alertService.info('', 'Bayar hanya untuk pasien umum', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    this.isCollapsed1 = true
    this.isCollapsed2 = true
    this.isCollapsed3 = false

  }
  bayarVAFinal() {
    // if (this.selectVA_BANK != 'BRI (BRIVA)') {
    //   this.alertService.error('', 'Maaf, Pembayaran dengan Bank ini belum tersedia', {
    //     toastClass: 'toast ngx-toastr',
    //     closeButton: true,
    //     positionClass: 'toast-bottom-center'
    //   });
    //   return
    // }
    if (this.selectVA_BANK == undefined) {
      this.alertService.error('', 'Pilih Bank Penyedia', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }

    this.isBayar = false
    if (this.selected.length == 0) {
      this.alertService.info('', 'Ceklis tindakan yang mau dibayar', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    let detail = []
    let pel = this.selected[0]
    for (let i = 0; i < pel.length; i++) {
      if (pel[i].strukfk != null) {
        this.alertService.info('', 'Ada Pelayanan yang sudah memiliki Tagihan, mohon cek Status pembayaran', {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
        return
      }

      detail.push({ 'norec': pel[i].norec })
    }
    let jsonTarek = {
      "data": {
        "noRegistrasi": this.billing.noregistrasi,
        "totalKlaim": 0,
        "jumlahBayar": this.billing.totalVA,
        "cekMultiPenjamin": false,
        "multiPenjamin": [],
        "datachecklist": detail
      }
    }
    this.isLoading = true
    this.httpservice.postAPI('medifirst2000/tatarekening/simpan-verifikasi-tagihan-tatarekening', jsonTarek).subscribe(res => {
      this.brigdingVA(res)
    }, error => {
      this.isLoading = false
    })
  }

  timer() {
    var days = Math.floor(this.seconds / 24 / 60 / 60);
    var hoursLeft = Math.floor((this.seconds) - (days * 86400));
    var hours = Math.floor(hoursLeft / 3600);
    var minutesLeft = Math.floor((hoursLeft) - (hours * 3600));
    var minutes = Math.floor(minutesLeft / 60);
    var remainingSeconds = this.seconds % 60;
    function pad(n) {
      return (n < 10 ? "0" + n : n);
    }
    this.va.batasBayarCount = pad(hours) + " jam " + pad(minutes) + " menit " + pad(remainingSeconds) + " detik ";
    if (this.seconds == 0) {
      // clearInterval(countdownTimer);
      this.va.batasBayarCount = 0;
    } else {
      this.seconds--;
    }
  }
  brigdingVA(response) {
    this.va = {}
    if (this.selectVA_BANK == 'BRI (BRIVA)') {
      this.saveBRIVA(response)
    } else if (this.selectVA_BANK == 'BNI') {
      this.saveBNI(response)
    } else if (this.selectVA_BANK == 'Bank OCBC NISP') {
      this.saveOCBC(response)
    } else {
      this.alertService.error('', "Metode Pembayaran Ini belum tersedia", {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
    }

  }
  saveBNI(response) {
    var today = new Date();
    today.setHours(today.getHours() + 2);
    this.billing.expiredVA = moment(today).format('YYYY-MM-DDTHH:mm:ss');
    // debugger
    let json = {

      "type": "createbilling",
      "client_id": "",
      "trx_id": "",
      "trx_amount": this.billing.totalVA,
      "tanpa_client_id": true,
      "billing_type": "c",
      "customer_name": this.billing.namaPasien,
      "customer_email": this.item.email,
      "customer_phone": this.item.nohp,
      "virtual_account": "",
      "datetime_expired": this.billing.expiredVA + "+07:00",
      "description": this.billing.keteranganVA,
      "norec_pd": this.billing.norecPd,
      "norec_sp": response.result.norec,
      "last_va": response.result.nostruk.substring(1)
    }
    // let json = {
    //   "institutionCode": "J104408",
    //   "brivaNo": BrivaNo,
    //   "custCode": response.result.nostruk.substring(1),
    //   "nama": this.billing.namaPasien,
    //   "amount": this.billing.totalVA,
    //   "keterangan": this.billing.keteranganVA,
    //   "expiredDate": this.billing.expiredVA
    // }

    this.httpservice.postAPI('medifirst2000/bni/create-billing', json).subscribe(res => {
      if (res.status == '000') {
        let noVA = res.data.virtual_account//BrivaNo + response.result.nostruk.substring(1)
        this.isCollapsed1 = false
        this.isCollapsed2 = true
        this.isCollapsed3 = true
        this.isBayar = true
        this.apiTimer = setInterval(() => {
          this.timer()
        }, (1000)); //1 second
        // this.va.batasBayarCount = this.counterExpired()
        this.va.batasBayar = this.billing.expiredVA
        this.va.total = this.billing.totalVARp
        this.va.noVa = noVA
        this.va.noStruk = response.result.nostruk
        this.isLoading = false
        // this.saveVALocal(json, response.result)
        this.alertService.success('', "Success Create VA", {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
      } else {
        this.isLoading = false
        this.isBayar = false
        this.alertService.error('', res.message, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
      }
    })
  }
  saveOCBC(response) {

  }
  saveBRIVA(response) {

    var today = new Date();
    today.setHours(today.getHours() + 2);
    this.billing.expiredVA = moment(today).format('YYYY-MM-DD HH:mm:ss');
    let BrivaNo = "77777"
    let json = {
      "institutionCode": "J104408",
      "brivaNo": BrivaNo,
      "custCode": response.result.nostruk.substring(1),
      "nama": this.billing.namaPasien,
      "amount": this.billing.totalVA,
      "keterangan": this.billing.keteranganVA,
      "expiredDate": this.billing.expiredVA
    }

    this.httpservice.postAPI('medifirst2000/bri/va/create-end-point', json).subscribe(res => {
      if (res.responseCode == '00') {
        let noVA = BrivaNo + response.result.nostruk.substring(1)
        this.isCollapsed1 = false
        this.isCollapsed2 = true
        this.isCollapsed3 = true
        this.isBayar = true
        this.apiTimer = setInterval(() => {
          this.timer()
        }, (1000)); //1 second
        // this.va.batasBayarCount = this.counterExpired()
        this.va.batasBayar = this.billing.expiredVA
        this.va.total = this.billing.totalVARp
        this.va.noVa = noVA
        this.va.noStruk = response.result.nostruk
        this.isLoading = false
        this.saveVALocal(json, response.result)
        this.alertService.success('', res.responseDescription, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
      } else {
        this.isLoading = false
        this.isBayar = false
        this.alertService.error('', res.errDesc, {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
      }
    })
  }
  saveVALocal(va, struk) {
    let json = {
      'norecSP': struk.norec,
      'nostruk': struk.nostruk,
      'va': va,
      'nohp': this.item.nohp,
      'nocmfk': this.item.nocmfk,
      'norecPD': this.billing.norecPd,
      'email': this.item.email,
    }
    this.httpservice.postAPI('medifirst2000/bri/va/save-lokal', json).subscribe(res => {

    })
  }
  tutupVA() {
    this.isBayar = false
    this.va = {}
  }
  cekStatusPem() {
    this.router.navigate(['daftar-tagihan'])
  }
}
