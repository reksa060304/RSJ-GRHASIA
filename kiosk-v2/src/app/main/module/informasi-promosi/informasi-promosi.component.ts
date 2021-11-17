import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { HttpService } from '../httpService';
@Component({
  selector: 'app-informasi-promosi',
  templateUrl: './informasi-promosi.component.html',
  styleUrls: ['./informasi-promosi.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InformasiPromosiComponent implements OnInit {
  displayDialog: boolean
  title: any
  isVisi: boolean
  isSejarah: boolean
  isDireksi: boolean
  isSlogan: boolean
  displayDialog2: boolean
  isPrestasi: boolean
  isMaps: boolean
  isLoad: boolean
  item: any = {
    deskripsi: ''
  }
  options:any
  contentHeader: any
  constructor(
    private httpService: HttpService,
    private alertService: ToastrService,
    private modalService: NgbModal

  ) { this.options = this.alertService.toastrConfig; }


  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Informasi Promosi',
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

}
