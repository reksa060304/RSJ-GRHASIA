import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { AuthenticationService } from 'app/auth/service';
import Stepper from 'bs-stepper';
import moment from 'moment';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { HttpService } from '../httpService';
import QRCode from 'qrcode';
@Component({
  selector: 'app-reservasi',
  templateUrl: './reservasi.component.html',
  styleUrls: ['./reservasi.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReservasiComponent implements OnInit {


  public contentHeader: object;
  public TDNameVar;
  public TDEmailVar;
  public TDFirstNameVar;
  public TDLastNameVar;
  public twitterVar;
  public facebookVar;
  public googleVar;
  public linkedinVar;
  public landmarkVar;
  public addressVar;
  public itemNik;
  max = new Date().setDate(new Date().getDate() + 21)
  minDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }
  maxDate = { year: new Date(this.max).getFullYear(), month: new Date(this.max).getMonth() + 1, day: new Date(this.max).getDate() }
  resultR: any = {}
  public basicDateOptions: FlatpickrOptions = {
    altInput: true,
    altFormat: 'Y-m-j',
  };

  listHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  isBaru: boolean = false
  isLama: boolean
  public selectBasic = [
    { name: 'UK' },
    { name: 'USA' },
    { name: 'Spain' },
    { name: 'France' },
    { name: 'Italy' },
    { name: 'Australia' }
  ];

  item: any = { tglReservasi: this.minDate, tgllahir: this.minDate }

  public selectMulti = [{ name: 'English' }, { name: 'French' }, { name: 'Spanish' }];
  public selectMultiSelected;
  public selectTipe = []

  // private
  private horizontalWizardStepper: Stepper;
  private bsStepper;
  listRuangan = []
  listDokter = []
  listTipePembayaran = []
  public listJK = []
  listJam = []
  public markDisabled
  isBPJS: boolean = false
  selectedCar: number;
  isSave: boolean = false;
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];
  resume: any = {}
  /**
   * Horizontal Wizard Stepper Next
   *
   * @param data
   */
  horizontalWizardStepperNext(data, modalSuccess) {
    if (data == '') {
      this.showResume(modalSuccess);
    }
    else if (data.form.valid === true) {
      this.horizontalWizardStepper.next();
    }
  }

  /**
   * Horizontal Wizard Stepper Previous
   */
  horizontalWizardStepperPrevious() {
    this.horizontalWizardStepper.previous();
  }


  onSubmit() {
    return false;
  }
  constructor(
    private config: NgSelectConfig,
    private router: Router,
    private route: ActivatedRoute,
    private httpservice: HttpService,
    private cacheHelper: CacheService,
    private alertService: ToastrService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar
  ) {

    // this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
  }

  ngOnInit() {

    this.httpservice.get('medifirst2000/reservasionline/get-libur').subscribe(e => {
      let arr = []
      if (e.libur.length > 0) {
        for (let i = 0; i < e.libur.length; i++) {
          const element = e.libur[i];
          arr.push(element.tgllibur)
        }
        this.markDisabled = (
          date: NgbDateStruct
          //current: { day: number; month: number; year: number }
        ) => {

          // const day: number = new Date(date.year, date.month, date.day).getDay()

          for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            // console.log(date.month);
            // console.log(moment(new Date(date.year,date.month,date.day)).format('YYYY/MM/DD'))
            if (moment(new Date(date.year, date.month - 1, date.day)).format('YYYY/MM/DD') == element) {
              return true
            }

          }
          // Prevent Saturday and Sunday from being selected.
          return this.calendar.getWeekday(new NgbDate(date.year, date.month, date.day)) != 7 ? false : true;



        }
      }
    })

    // this.markDisabled = (
    //   date: NgbDateStruct
    //   //current: { day: number; month: number; year: number }
    // ) => {
    //   return this.json.disabledDates.find(x =>
    //     (new NgbDate(x.year, x.month, x.day).equals(date)) 
    //     || (this.json.disable.includes(calendar.getWeekday(new NgbDate(date.year,date.month,date.day))) )
    //   )
    //     ? true
    //     : false;
    // };
    // this.markDisabled = (date: NgbDate) => { return this.calendar.getWeekday(date) >= 6 };

    this.bsStepper = document.querySelectorAll('.bs-stepper');

    // content header
    this.contentHeader = {
      headerTitle: 'Reservasi',
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
            name: 'Reservasi',
            isLink: false
          }
        ]
      }
    };
    this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {});
    this.item.nik = this._authenticationService.currentUserValue.login.nik
    if (this._authenticationService.currentUserValue.pasien != null) {
      this.horizontalWizardStepper.to(2)
      this.item.nocmLama = this._authenticationService.currentUserValue.pasien.nocm
      this.item.namaLama = this._authenticationService.currentUserValue.firstName
      this.item.namapasien = this._authenticationService.currentUserValue.firstName
      this.item.nohp = this._authenticationService.currentUserValue.pasien.nohp
      this.item.jenisKelamin = {
        id: this._authenticationService.currentUserValue.pasien.objectjeniskelaminfk,
        jeniskelamin: this._authenticationService.currentUserValue.pasien.jeniskelamin
      }
      let tgl = this._authenticationService.currentUserValue.pasien.tgllahir

      this.item.tgllahir = {
        year: new Date(tgl).getFullYear(),
        month: new Date(tgl).getMonth() + 1, day: new Date(tgl).getDate()
      }
    } else {
      this.horizontalWizardStepper.to(1)
      let tgl = this._authenticationService.currentUserValue.tgllahir
      this.item.nik = this._authenticationService.currentUserValue.login.nik
      this.item.namapasien = this._authenticationService.currentUserValue.firstName
      this.selectedJenis2(1)
      this.item.tgllahir = {
        year: new Date(tgl).getFullYear(),
        month: new Date(tgl).getMonth() + 1,
        day: new Date(tgl).getDate()
      }
    }

    this.setCombo()

    // this.verticalWizardStepper = new Stepper(document.querySelector('#stepper2'), {
    //   linear: false,
    //   animation: true
    // });

    // this.modernWizardStepper = new Stepper(document.querySelector('#stepper3'), {
    //   linear: false,
    //   animation: true
    // });

    // this.modernVerticalWizardStepper = new Stepper(document.querySelector('#stepper4'), {
    //   linear: false,
    //   animation: true
    // });


  }
  showResume(modalSuccess) {
    if (this.item.namapasien == undefined) {
      this.alertService.warning('', 'Nama Pasien harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }

    if (this.item.tgllahir === undefined) {
      this.alertService.warning('', 'Tgl Lahir harus di isi', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (this.item.poli == undefined) {
      this.alertService.warning('', 'Poli Tujuan harus di pilih', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (this.item.jam == undefined) {
      this.alertService.warning('', 'Jam Reservasi harus di pilih', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    if (this.item.kelompokPasien == undefined) {
      this.alertService.warning('', 'Tipe Pembayaran harus di pilih', {
        toastClass: 'toast ngx-toastr',
        closeButton: true,
        positionClass: 'toast-bottom-center'
      });
      return
    }
    this.resume.namapasien = this.item.namapasien
    this.resume.tgllahir = this.formatter.format(this.item.tgllahir)
    this.resume.poli = this.item.poli.namaruangan

    // let date = this.item.tglReservasi
    this.resume.tglreservasi = this.formatter.format(this.item.tglReservasi) + ' ' + this.item.jam.jam
    this.resume.jenispasien = this.item.kelompokPasien.kelompokpasien

    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: 'modal modal-success'
    });
  }
  save() {
    if (this.isBPJS) {
      this.isSave = true
      if (this.item.noRujukan != undefined && this.item.noRujukan.toString().length == 19) {
        this.httpservice.get('medifirst2000/bridging/bpjs/get-rujukan-pcare?norujukan=' + this.item.noRujukan).subscribe(e => {
          if (e.response != null) {
            this.toastRujukanAktif(e)
            this.item.noKartuPeserta = e.response.rujukan.peserta.noKartu
            this.isSave = false
            this.LanjutSave()
          } else {
            this.httpservice.get('medifirst2000/bridging/bpjs/get-rujukan-rs?norujukan=' + this.item.noRujukan).subscribe(e => {
              if (e.response != null) {
                this.toastRujukanAktif(e)
                this.item.noRujukan = e.response.rujukan.noKunjungan
              } else {
                this.toastRujukan()
              }
              this.isSave = false
              this.LanjutSave()
            }, error => {
              this.toastRujukan()
              this.isSave = false
            })

          }
        }, error => {
          this.toastRujukan()
          this.isSave = false
        })
      } else {
        if (this.item.noKartuPeserta != undefined) {
          this.httpservice.get('medifirst2000/bridging/bpjs/get-rujukan-pcare-nokartu?nokartu=' + this.item.noKartuPeserta).subscribe(e => {
            if (e.response != null) {
              this.toastRujukanAktif(e)
              this.item.noKartuPeserta = e.response.rujukan.peserta.noKartu

              this.LanjutSave()
              this.isSave = false
            } else {
              this.httpservice.get('medifirst2000/bridging/bpjs/get-rujukan-rs-nokartu?nokartu=' + this.item.noKartuPeserta).subscribe(e => {
                if (e.response != null) {

                  this.toastRujukanAktif(e)
                  this.item.noRujukan = e.response.rujukan.noKunjungan
                } else {
                  this.toastRujukan()
                }
                this.isSave = false
                this.LanjutSave()
              }, error => {
                this.isSave = false
                this.toastRujukan()
              })
            }

          }, error => {
            this.isSave = false
            this.toastRujukan()
          })
        }
      }
    } else {
      this.LanjutSave()
    }

  }
  toastRujukanAktif(e) {
    this.alertService.info('No Rujukan', e.response.rujukan.noKunjungan, {
      toastClass: 'toast ngx-toastr',
      closeButton: true,
      positionClass: 'toast-bottom-center'
    });
    this.alertService.info('Status Peserta BPJS', e.response.rujukan.peserta.statusPeserta.keterangan, {
      toastClass: 'toast ngx-toastr',
      closeButton: true,
      positionClass: 'toast-bottom-center'
    });
  }
  toastRujukan() {
    this.alertService.warning('', 'Rujukan Tidak Ada atau Masa Berlaku habis', {
      toastClass: 'toast ngx-toastr',
      closeButton: true,
      positionClass: 'toast-bottom-center'
    });
  }
  LanjutSave() {
    // debugger
    let json = {
      "namaPasien": this.resume.namapasien,
      "jenisKelamin": {
        "id": this.item.jenisKelamin.id,
        "jeniskelamin": this.item.jenisKelamin.jeniskelamin,
      },
      "tglLahir": this.resume.tgllahir,
      "noTelpon": this.item.nohp,
      "noCm": this.item.nocmLama != undefined ? this.item.nocmLama : "",
      "tglLahirLama": this.resume.tgllahir,
      "dokter": null,
      "poliKlinik": {
        "id": this.item.poli.id,
        "namaruangan": this.item.poli.namaruangan,
        "objectdepartemenfk": this.item.poli.objectdepartemenfk
      },
      "tipePembayaran": {
        "id": this.item.kelompokPasien.id,
        "kelompokpasien": this.item.kelompokPasien.kelompokpasien,
      },
      "noKartuPeserta": this.item.noKartuPeserta != undefined ? this.item.noKartuPeserta : null,
      "jamReservasi": {
        "jam": this.item.jam.jam
      },
      "noRujukan": this.item.noRujukan != undefined ? this.item.noRujukan : null,
      "tglReservasiFix": this.resume.tglreservasi,
      "isBaru": this.isBaru,
      "tglAwal": null,
      "tglAkhir": null,
      "nik": this.item.nik,
      "namaPasienDukcapil": null
    }
    this.isSave = true
    this.httpservice.post('medifirst2000/reservasionline/save', json).subscribe(e => {
      this.isSave = false
      let tglReserDay = new Date(e.data.tanggalreservasi)
      let _hari = tglReserDay.getDay();
      let hariFix = this.listHari[_hari]
      this.resultR = e.data
      this.resultR.tgl = hariFix + ', ' + moment(new Date(e.data.tanggalreservasi)).format('DD-MMM-YYYY HH:mm') //HH:mm
      this.resultR.tgllahir = moment(new Date(this.resume.tgllahir)).format('DD-MMM-YYYY')
      QRCode.toDataURL(this.resultR.noreservasi)
        .then(url => {
          this.resultR.qrCode = url
          console.log(url)
        })
        .catch(err => {
          console.error(err)
        })
      this.horizontalWizardStepper.to(3)
      this.modalService.dismissAll();
    }, err => {
      this.isSave = false
    })
  }
  popUpQR() {

  }
  setCombo() {
    this.listRuangan = []
    this.listDokter = []
    this.listTipePembayaran = []
    this.httpservice.get('medifirst2000/reservasionline/get-list-data').subscribe(e => {

      // this.listRuangan.push({ label: 'Please select an options', value: null })
      // e.ruanganrajal.forEach(element => {
      //   this.listRuangan.push({
      //     label: element.namaruangan,
      //     value: {
      //       'id': element.id,
      //       'namaruangan': element.namaruangan
      //     }
      //   })
      // });
      e.jeniskelamin.forEach(element => {
        this.listJK.push(element)
      });
      e.ruanganrajal.forEach(element => {
        this.listRuangan.push(element)
      });
      e.dokter.forEach(element => {
        this.listDokter.push(element)
      });
      e.kelompokpasien.forEach(element => {
        this.listTipePembayaran.push(element)
      });

    }, error => {

    })
  }
  selectedJenis2(select) {
    if (select == 1) {
      this.isBaru = true
      this.isLama = false
    } else if (select == 2) {
      this.isBaru = false
      this.isLama = true
    } else {
      this.isBaru = false
      this.isLama = false
    }
  }
  changeDate(e) {
    this.listJam = []
    if (this.item.tglReservasi != undefined && this.item.poli != undefined) {
      this.httpservice.get('medifirst2000/reservasionline/get-slotting-new?ruanganfk=' + this.item.poli.id
        + '&tgl=' + moment(this.formatter.format(this.item.tglReservasi)).format('YYYY-MM-DD')).subscribe(e => {
          if (e.slot.length > 0) {
            this.alertService.info('', e.message, {
              toastClass: 'toast ngx-toastr',
              closeButton: true,
              positionClass: 'toast-bottom-center'
            });
            this.listJam = e.slot
          } else {
            this.alertService.warning('', e.message, {
              toastClass: 'toast ngx-toastr',
              closeButton: true,
              positionClass: 'toast-bottom-center'
            });
          }
        })
    }
  }
  changeTipe(e) {
    this.isBPJS = false
    if (this.item.kelompokPasien != undefined && this.item.kelompokPasien.id == 2) {
      this.isBPJS = true

    }
  }
}
