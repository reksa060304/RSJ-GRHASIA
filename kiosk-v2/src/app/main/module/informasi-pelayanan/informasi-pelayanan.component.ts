import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { HttpService } from '../httpService';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-informasi-pelayanan',
  templateUrl: './informasi-pelayanan.component.html',
  styleUrls: ['./informasi-pelayanan.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InformasiPelayananComponent implements OnInit {

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
    this.contentHeader = {
      headerTitle: 'Informasi Pelayanan',
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
    this.httpService.get("medifirst2000/kiosk/get-combo").subscribe(e => {

      this.listKelas = [];
      this.listKelas.push({ label: '-- Kelas --', value: null });
      e.kelas.forEach(response => {
        this.listKelas.push({
          label: response.namakelas,
          value: {
            'id': response.id,
            'namakelas': response.namakelas
          }
        });
      });

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

      this.listJenisPel = [{
        label: 'Reguler',
        value: {
          id: 1,
          jenispelayanan: 'Reguler',
        }
      },
      {
        label: 'Eksekutif',
        value: {
          id: 2,
          jenispelayanan: 'Eksekutif',
        }
      },
      ]
    }, error => {
      this.listKelas = []
      this.listRuangan = []
    })

  }
  // modal Open Success
  modalOpenSuccess(modalSuccess) {
    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: 'modal modal-success'
    });
  }
  showPopUp(data, modalSuccess) {
    this.httpService.get('medifirst2000/sysadmin/master/get-setting-kios').subscribe(resp => {
      this.isLoad = true

      this.title = data
      let status = false
      for (let i = 0; i < resp.data.length; i++) {
        const element = resp.data[i];
        status = false
        if (element.jenis == data) {
          status = true
          this.item.deskripsi = element.deskripsi
          this.modalService.open(modalSuccess, {
            centered: true,
            windowClass: 'modal modal-success'
          });
          break
        }
      }
      if (status == false) {
        this.alertService.info('', 'Informasi ini belum di setting', {
          toastClass: 'toast ngx-toastr',
          closeButton: true,
          positionClass: 'toast-bottom-center'
        });
        // this.alertService.info('Info','Informasi ini belum di setting')
        return
      }
    })


  }
  getTarif() {

    this.showTarif = true
    this.cariTarif()
  }
  clearTarif() {
  }
  cariTarif() {
    this.loading = true
    let produk = ''
    if (this.item.namaProduk != undefined)
      produk = this.item.namaProduk

    let kelas = ''
    if (this.item.kelas != undefined)
      kelas = this.item.kelas.id

    let ruangan = ''
    if (this.item.ruangan != undefined)
      ruangan = this.item.ruangan.id

    let jenisPel = ''
    if (this.item.jenisPelayanan != undefined)
      jenisPel = this.item.jenisPelayanan.id

    this.httpService.get('medifirst2000/kiosk/get-tarif?produkId=&namaproduk='
      + produk + '&kelasId=' + kelas + '&jenispelayananId=' + jenisPel + '&ruanganId=' + ruangan).subscribe(e => {
        this.loading = false
        for (let i = 0; i < e.data.length; i++) {
          const element = e.data[i];
          element.hargalayanan = this.formatRupiah(element.hargalayanan, 'Rp. ');
          element.no = i + 1
        }
        this.rows = e.data;
      }, error => {
        this.loading = false
      })
  }
  formatRupiah(value, currency) {
    return currency + "" + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }

}

