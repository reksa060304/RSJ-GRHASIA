import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { HttpService } from '../httpService';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import moment from 'moment';
@Component({
  selector: 'app-informasi-kamar',
  templateUrl: './informasi-kamar.component.html',
  styleUrls: ['./informasi-kamar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InformasiKamarComponent implements OnInit {

  displayDialog: boolean
  title: any
  public rows: any;
  public ColumnMode = ColumnMode;
  isLoad: boolean
  item: any = {
    deskripsi: ''
  }
  loading: boolean = false
  options: any
  contentHeader: any
  showTarif: boolean
  private _unsubscribeAll: Subject<any>
  listRuangan: any[]//SelectItem[]
  listJenisPel: any[]//SelectItem[]
  listKelas: any[]//SelectItem[]

  dataKamar: any;
  jumlahTempatTidur: any = 0;
  JumlahIsi: any = 0;
  JumlahKosong: any = 0;
  totalKamar: any = 0
  isShowKamar: boolean
  apiTimer: any;
  counter = 10;
  showPoli: boolean
  ruangans: any
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private cacheHelper: CacheService,
    private http: HttpClient,
    private alertService: ToastrService,
    private modalService: NgbModal,

  ) { this.options = this.alertService.toastrConfig; }

  ngOnInit(): void {
    this.apiTimer = setInterval(() => {
      this.getData()
    }, (this.counter * 18000)); //60 detik
    this.getData()
    this.contentHeader = {
      headerTitle: 'Informasi Kamar',
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
  getData() {
    this.isShowKamar = true
    this.httpService.get('medifirst2000/kiosk/get-view-bed-tea').subscribe(e => {
      var data: any = e[0];
      this.jumlahTempatTidur = data.kamartotal;
      this.JumlahIsi = data.kamarisi;
      this.JumlahKosong = data.kamarkosong;
      // this.jumlahTempatTidur=this.jumlahTempatTidur.kamartotal
    })
    this.httpService.get('medifirst2000/kiosk/get-view-bed').subscribe(e => {
      var data: any = e;
      var arrRuang = [];
      var arrKamar = [];
      var arrTT = [];
      var arr = [];
      var arrayS = {};
      var arrayK = {};
      var arrayM = {};
      var stt = true;
      for (var i = 0; i < data.length; i++) {
        arrayM = {
          idtempattidur: data[i].idtempattidur,
          idruangan: data[i].idruangan,
          namaruangan: data[i].namaruangan,
          idkamar: data[i].idkamar,
          namakamar: data[i].namakamar,
          reportdisplay: data[i].reportdisplay,
          nomorbed: data[i].nomorbed,
          idstatusbed: data[i].idstatusbed,
          statusbed: data[i].statusbed
        };
        arrTT.push(arrayM)
      }
      for (var i = 0; i < data.length; i++) {
        //kamar
        stt = true;
        for (var j = 0; j < arrKamar.length; j++) {
          if (data[i].idkamar == arrKamar[j].idkamar) {
            arrKamar[j].qtyBed = arrKamar[j].qtyBed + 1;
            if (data[i].idstatusbed == 1) {
              arrKamar[j].isi = arrKamar[j].isi + 1;
            } else {
              arrKamar[j].kosong = arrKamar[j].kosong + 1;
            }
            stt = false;
          }
        }
        if (stt == true) {
          var arrTTT = [];
          for (var j = 0; j < arrTT.length; j++) {
            if (arrTT[j].idkamar == data[i].idkamar) {
              arrTTT.push(arrTT[j]);
            }
          }

          if (data[i].idstatusbed == 1) {
            arrayK = {
              idruangan: data[i].idruangan,
              idkamar: data[i].idkamar,
              namakamar: data[i].namakamar,
              idkelas: data[i].idkelas,
              namakelas: data[i].namakelas,
              qtyBed: 1,
              isi: 1,
              kosong: 0,
              tempattidur: arrTTT
            };
          } else {
            arrayK = {
              idruangan: data[i].idruangan,
              idkamar: data[i].idkamar,
              namakamar: data[i].namakamar,
              idkelas: data[i].idkelas,
              namakelas: data[i].namakelas,
              qtyBed: 1,
              isi: 0,
              kosong: 1,
              tempattidur: arrTTT
            };
          }
          arrKamar.push(arrayK);
        }


      }
      var sama = false
      var newAr = [];
      
      for (let i = 0; i < arrKamar.length; i++) {
        sama = false;
        for (let z = 0; z < newAr.length; z++) {
          if (arrKamar[i].namakelas == newAr[z].namakelas && arrKamar[i].idruangan == newAr[z].idruangan) {
            sama = true;
            // newAr[z].namakelas = arrKamar[i].namakelas
            newAr[z].qtyBed = newAr[z].qtyBed + arrKamar[i].qtyBed
            newAr[z].kosong = newAr[z].kosong + arrKamar[i].kosong
            newAr[z].isi = newAr[z].isi + arrKamar[i].isi
          }
        }
        if (sama == false) {
          var datas = {
            namakelas: arrKamar[i].namakelas,
            idruangan: arrKamar[i].idruangan,
            qtyBed: arrKamar[i].qtyBed,
            isi: arrKamar[i].isi,
            kosong: arrKamar[i].kosong,
          }
          newAr.push(datas);
        }
      }
      //console.log(newAr)

      for (var i = 0; i < data.length; i++) {
        //ruang
        stt = true;
        for (var j = 0; j < arrRuang.length; j++) {
          if (data[i].idruangan == arrRuang[j].idruangan) {
            arrRuang[j].qtyBed = arrRuang[j].qtyBed + 1;
            if (data[i].idstatusbed == 1) {
              arrRuang[j].isi = arrRuang[j].isi + 1;
            } else {
              arrRuang[j].kosong = arrRuang[j].kosong + 1;
            }
            stt = false;
          }
        }
        if (stt == true) {
          var arrTTT = [];
          for (var j = 0; j < newAr.length; j++) {
            if (newAr[j].idruangan == data[i].idruangan) {
              arrTTT.push(newAr[j]);
            }
          }
          if (data[i].idstatusbed == 1) {
            arrayS = {
              idruangan: data[i].idruangan,
              namaruangan: data[i].namaruangan,
              qtyBed: 1,
              isi: 1,
              kosong: 0,
              kamar: arrTTT
            };
          } else {
            arrayS = {
              idruangan: data[i].idruangan,
              namaruangan: data[i].namaruangan,
              qtyBed: 1,
              isi: 0,
              kosong: 1,
              kamar: arrTTT
            };
          }

          arrRuang.push(arrayS);
        }

      }
      let warna = ['sales', 'views', 'users', 'checkin',
        'warna1', 'warna2', 'warna3', 'warna4',
        'sales', 'views', 'users', 'checkin',
        'warna1', 'warna2', 'warna3', 'warna4',
        'sales', 'views', 'users', 'checkin',
        'warna1', 'warna2', 'warna3', 'warna4',
        'sales', 'views', 'users', 'checkin',
        'warna1', 'warna2', 'warna3', 'warna4',
        'sales', 'views', 'users', 'checkin']
      for (let i = 0; i < arrRuang.length; i++) {
        arrRuang[i].warna = warna[i]
        if (arrRuang[i].qtyBed == arrRuang[i].isi)
          arrRuang[i].bg = 'bg-maroon-gradient'
        else
          arrRuang[i].bg = 'bg-aqua-gradient'

      }
      this.isShowKamar = false
      //console.log(arrRuang)
      this.dataKamar = arrRuang
      this.totalKamar = arrRuang.length
    })
  }
  lookDetail(idRU, namaruangan,modalSuccess) {
    this.httpService.get("medifirst2000/rawatinap/get-daftar-pasien-masih-dirawat?ruanganId=" + idRU).subscribe(e => {
      if (e.data.length == 0)
        return
      else {
        this.displayDialog = true
        this.ruangans = namaruangan
        for (let i = 0; i < e.data.length; i++) {
          const element = e.data[i];
          element.tglregistrasi = moment(new Date(element.tglregistrasi)).format('DD-MM-YYY HH:mm')
        }
        this.rows =e.data;
        this.modalService.open(modalSuccess, {
          centered: true,
          windowClass: 'modal modal-success',
          size: 'xl'
        });
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      }

    })
  }

}
