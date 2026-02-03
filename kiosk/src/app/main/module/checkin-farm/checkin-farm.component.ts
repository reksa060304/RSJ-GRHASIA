import { HttpClient } from '@angular/common/http';
import { Component, OnInit,AfterViewInit, ViewEncapsulation,  ElementRef, Renderer2 } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../cache.service';
import { Configuration } from '../config';
import { HttpService } from '../httpService';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-checkin',
  templateUrl: './checkin-farm.component.html',
  styleUrls: ['./checkin-farm.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class CheckinFarmComponent implements OnInit , AfterViewInit{
  contentHeader: any
  url: any
  sub: any;
  isInfoPasien: boolean = false
  item: any = {}
  dataCheckin: any ={}
  dataCache: any
  batasJamCheckin = 1
  isloading: boolean = false
  model: any

  isCetakDSKiosk: any = 'true'
  isAdminOtomatisKiosk: any
  constructor(private router: Router,
    private route: ActivatedRoute,
    private httpservice: HttpService,
    // private fb: FormBuilder,
    private cacheHelper: CacheService,
    private service: HttpClient,
    private alertService: ToastrService,
    private elementRef: ElementRef,
    private renderer: Renderer2,) {
    let sett = localStorage.getItem('isCetakDS')
    if (sett != null) {
      this.isCetakDSKiosk = sett
    }
  }

  ngOnInit(): void {

    this.addClickListenerToForm()
   
    this.contentHeader = {
      headerTitle: 'Antrian Farmasi',
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


  addClickListenerToForm() {
    this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
      this.focusInput();
    });
  }

  focusInput() {
    const inputElement: HTMLInputElement = this.elementRef.nativeElement.querySelector('input');
    if (inputElement) {
      inputElement.focus();
    }
  }

  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return diff; 
  }

  ngAfterViewInit(): void {
    this.setFocusOnInput();
  }

  private setFocusOnInput(): void {
    const inputElement = this.elementRef.nativeElement.querySelector('input[type="text"]');
    if (inputElement) {
      inputElement.focus();
    }
  }

    noRegFarm = '';
  submitNoRegFarm() {
    if (this.noRegFarm) {
    console.log('Nomor reservasi:', this.noRegFarm);
    // this.closePopup();
    window.open(Configuration.get().apiBackend + 'medifirst2000/report/cetak-antrian-farm?noreg='
            + this.noRegFarm
            + '&kdprofile=21', '_blank');

      this.noRegFarm = undefined
    } else {
    alert('Masukan No Registrasi Terlebih Dahulu.');
    }
    // jalankan logika pencarian / validasi
    // this.closePopup();
  }
}
