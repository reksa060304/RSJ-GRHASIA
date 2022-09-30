import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { Config } from 'src/app/guard';
import { ApiService, AuthService } from 'src/app/service';
import { AlertService } from 'src/app/service/component/alert/alert.service';
import { SocketService } from 'src/app/service/socket.service';
@Component({
  selector: 'app-viewer-farmasi',
  templateUrl: './viewer-farmasi.component.html',
  styleUrls: ['./viewer-farmasi.component.scss']
})
export class ViewerFarmasiComponent implements OnInit {


  item: any = {}
  apiTimer: any;
  dataSource: any[] = []
  color = ['white', 'blue', 'gray', 'darkgray', 'orange']
  listKelas = []
  dipanggilN: boolean = false;
  dipanggilR: boolean = false;
  value = 10
  antriTerakhirN: any
  antriTerakhirR: any
  count_defaultTable: any = 15
  countTable: any = this.count_defaultTable
  totalPage: any = 3
  page_otomatis: any = 1
  page_default: any = 1
  infoPage: any
  timerTables: any
  start_otomatis: any = 0
  limit_otomatis: any = 10
  count_defaultPanel: any = 60
  countPanel = this.count_defaultPanel
  timerPanels: any
  isFullscreen: boolean
  numberss = Array(5).map((x, i) => i);
  isActive = false;
  elem: any;
  namaProfile = Config.getProfile().namaProfile
  listRuanganAktif: any = []
  listRuangan: any = []
  paramRuang: any
  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private socket: SocketService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: any
  ) {
    this.apiService.get('viewer/get-data-viewer-far').subscribe(e => {
      this.listRuangan = e.farmasi
      this.paramRuang = ''
      this.listRuanganAktif = []
      this.route.params.subscribe(params => {
        // Defaults to 0 if no query param provided.
        let ru = params['ruanganid'];

        this.paramRuang = ru
        this.listRuanganAktif = []
        let arr = ru.split(',')
        for (let i = 0; i < this.listRuangan.length; i++) {
          const element = this.listRuangan[i];
          for (let x = 0; x < arr.length; x++) {
            const element2 = arr[x];
            if (element.id == element2) {
              this.listRuanganAktif.push({
                'namaruangan': element.namaruangan,
                'nocounter': element.nocounter != null ? element.nocounter : 12,
                'noantri': '-'
              })
            }
          }
        }

        if (this.paramRuang == undefined) return

      });
      if (e.data.length > 0) {
        for (let i = 0; i < e.data.length; i++) {
          const element = e.data[i];
          if (element.jenis == "N") {
            this.item.antriTerakhirN = element.jenis + '-' + element.noantrian
          }
          if (element.jenis == "R") {
            this.item.antriTerakhirR = element.jenis + '-' + element.noantrian
          }
        }
      }
    })
    this.socket.on('tampilkan-antrian-farmasi', (data: any) => {

      let result = JSON.parse(data)
      let status = false
      if (result.status == 'load') {
        this.load()
      } else {
        var no = result.noantri
        status = false

        for (let x = 0; x < this.listRuanganAktif.length; x++) {
          const element2 = this.listRuanganAktif[x];
          if (element2.namaruangan == result.namaruangan) {
            status = true
            this.item.antriTerakhir = result.noregistrasi.substring(4)
            this.item.jenis = result.jenis
            this.item.ruangan = result.namaruangan
            no = this.item.antriTerakhir
            break
          }
        }
      }
      if (status == true) {
        if (this.item.jenis == 'Non Racikan') {
          this.dipanggilN = true
          this.antriTerakhirN = this.item.antriTerakhir
        } else {
          this.dipanggilR = true
          this.antriTerakhirR = this.item.antriTerakhir
        }
        this.playAudio('Nomor Antrian. ' + no
          + '. Ke Loket . Farmasi');
      }


    });

  }

  ngOnInit(): void {
    this.elem = document.documentElement;
    this.load()

    // this.loadTable(this.start_otomatis, this.limit_otomatis)
    // this.loadKelas()
    // this.apiTimer = setInterval(() => {
    //   this.timerTable()
    //   this.timerPanel()
    // }, (1000)); //1 second


  }
  playAudio(nomor) {

    // setTimeout(() => {

    var synthesis = window.speechSynthesis;
    // Get the first `en` language voice in the list
    var voice = synthesis.getVoices().filter(function (voice) {
      return voice.lang === 'id-ID';
    })[0];
    // Create an utterance object
    var utterance = new SpeechSynthesisUtterance(nomor);
    // Set utterance properties 
    utterance.voice = voice;
    utterance.lang = 'id-ID';
    // utterance.text = document.querySelector("textarea").value;
    utterance.pitch = 1;
    utterance.rate = 0.8;
    utterance.volume = 1;
    // Speak the utterance
    synthesis.speak(utterance);
    // this.audio.pause();

    setTimeout(() => {
      this.dipanggilN = false
      this.dipanggilR = false
    }, (5000));

  }
  load() {
    this.dataSource = []
    this.apiService.get('viewer/get-list-antrian-farmasi').subscribe(e => {

      this.dataSource = e
    })

  }
  // timerPanel() {
  //   this.countPanel = this.countPanel - 1;
  //   if (this.countPanel <= 0) {
  //     this.countPanel = this.count_defaultPanel;
  //     this.loadKelas();

  //   }
  //   this.timerPanels = this.countPanel + " Detik"; // watch
  // }

  // timerTable() {
  //   this.countTable = this.countTable - 1;
  //   if (this.countTable <= 0) {
  //     this.countTable = this.count_defaultTable;

  //     // event Load Table

  //     // page selanjutnya
  //     this.page_otomatis = this.page_otomatis + 1;
  //     if (this.page_otomatis > this.totalPage) {
  //       this.page_otomatis = this.page_default;
  //     }

  //     this.start_otomatis = 0;
  //     this.limit_otomatis = 10;
  //     for (var j = 1; j <= this.totalPage; j++) {
  //       if (j == this.page_otomatis) {
  //         this.loadTable(this.start_otomatis, this.limit_otomatis);
  //       }

  //       this.start_otomatis = this.start_otomatis + 10;

  //     }



  //   }
  //   this.infoPage = this.page_otomatis + ' dari ' + this.totalPage + ' Halaman'; // info page
  //   this.timerTables = this.countTable + " Detik"; // watch
  // }
  // loadTable(start, limit_otomatis) {
  //   this.dataSource = []
  //   this.apiService.get('bed/get-ruangan?offset=' + start + '&limit=' + limit_otomatis).subscribe(e => {

  //     for (let x = 0; x < e.length; x++) {
  //       const element = e[x];
  //       element.no = start + x + 1
  //     }
  //     this.dataSource = e
  //   })
  // }
  // loadKelas() {
  //   this.listKelas = []
  //   this.apiService.get('bed/get-kelas').subscribe(e => {
  //     let z = 0
  //     for (let x = 0; x < e.length; x++) {
  //       const element = e[x];
  //       if (this.color[z] == undefined) z = 0
  //       element.sisa = parseFloat(element.kapasitas) - parseFloat(element.tersedia)
  //       element.persen = parseFloat(element.sisa) / parseFloat(element.kapasitas) * 100
  //       element.color = this.color[z]
  //       z = z + 1
  //     }
  //     this.listKelas = e
  //   })
  // }
  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    this.isFullscreen = true
  }
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    this.isFullscreen = false
  }
}
