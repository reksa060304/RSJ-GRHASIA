
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service';
import { AlertService } from 'src/app/service/component/alert/alert.service';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-caller',
  templateUrl: './caller.component.html',
  styleUrls: ['./caller.component.scss']
})
export class CallerComponent implements OnInit {
  item: any = {}
  dataTable: any[];
  column: any[];
  dataPanggil: any[] = []
  isPanggil: boolean = false;
  constructor(
    private socket: SocketService,
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.socket.on('get-list-antrian', (data: any) => {
      let result = JSON.parse(data)
      this.load()
    });
  }

  ngOnInit(): void {
    this.column = [
      { field: 'jenis', header: 'Jenis', width: "100px" },
      { field: 'sekarang', header: 'Sekarang', width: "150px" },
      { field: 'sisa', header: 'Sisa', width: "150px" },

    ];
    this.load()
    this.item.loket = 1
    this.item.jenis = 'A'

  }
  load() {
    this.isPanggil = false
    this.apiService.get('viewer/get-list-antrian').subscribe(e => {
      this.dataTable = e.data
      // this.dataPanggil = e.last
      this.isPanggil = true
    })
  }
  panggil() {
    this.apiService.get('viewer/get-list-antrian').subscribe(e => {
      this.dataTable = e.data
      let aya = false
      for (let i = 0; i < this.dataTable.length; i++) {
        const element = this.dataTable[i];
        if (element.jenis == this.item.jenis && element.sisa != 0) {
          this.item.no = element.sekarang + 1
          aya = true
          break
        }
      }
      if (aya == false) {
        this.alertService.info('Informasi', 'Antrian Habis')
        return
      }
      this.socket.emit('caller', { no: this.item.jenis + '-' + this.setNumberStr(this.item.no), loket: this.item.loket });
      this.item.noantri = this.item.no
      this.updatePanggil(this.item.jenis, this.item.loket)
    })

  }
  panggilUlang() {
    if (this.item.noantri == undefined) {
      this.alertService.info('Informasi', 'Isi No Antrian yang mau dipanggil')
      return
    }
    // for (let i = 0; i < this.dataTable.length; i++) {
    //   const element = this.dataTable[i];
    //   if (parseFloat(this.item.noantri) > element.sekarang && this.item.jenis == element.jenis) {
    //     this.alertService.info('Informasi', 'Mohon panggil ulang nomor yang belum di panggil')
    //     return
    //   }
    // }
    this.socket.emit('caller', { no: this.item.jenis + '-' + this.setNumberStr(this.item.noantri), loket: this.item.loket });
    // this.updatePanggil(this.item.jenis, this.item.loket)
  }
  setNumberStr(nomer) {
    var str = "" + nomer
    var pad = "000"
    var ans = pad.substring(0, pad.length - str.length) + str
    return ans;
  }
  updatePanggil(jenis, loket) {
    this.apiService.get('viewer/update-antrian?jenis=' + jenis + '&loket=' + loket).subscribe(e => {
      // if (e.msg != 'Antrian Ada') {
      //   this.alertService.info('Informasi', e.msg)
      //   return
      // } else {
      //   this.load()
      // }
    })
  }
  refresh() {
    this.load()
  }
  shortcutLoket(loket) {
    this.item.loket = loket

  }
  shortcutJenis(jenis) {
    this.item.jenis = jenis
  }
}