import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { HttpService } from '../httpService';
@Component({
  selector: 'app-informasi-bantuan',
  templateUrl: './informasi-bantuan.component.html',
  styleUrls: ['./informasi-bantuan.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InformasiBantuanComponent implements OnInit {
  displayDialog: boolean
  title: any
  item: any = {}
  options: any
  contentHeader: any
  constructor(
    private httpService: HttpService,
    private alertService: ToastrService,
    private modalService: NgbModal

  ) { this.options = this.alertService.toastrConfig; }


  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Survey Kepuasan',
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
    this.item.idkepuasan = data
    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: 'modal modal-success'
    });
  }
  simpanSurvey() {
    var objSave = {
      id: this.item.idkepuasan,
      namalengkap: this.item.nama != '' ? this.item.nama : null
    }
    this.httpService.post('medifirst2000/kiosk/save-survey', objSave).subscribe(e => {
      this.item = {}
      this.modalService.dismissAll({
        centered: true,
        windowClass: 'modal modal-success'
      });
    })
  }
}
