import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { DPlayerService } from 'angular-dplayer';
import { StreamState } from 'src/app/interfaces/stream-state';
import { ApiService } from 'src/app/service';
import { NotificationService } from 'src/app/service/notification.service';
import { SocketService } from 'src/app/service/socket.service';
import Terbilang from 'terbilang-ts'
import { Howl, Howler } from 'howler';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Config } from 'src/app/guard';
@Component({
  selector: 'app-viewer-poli',
  templateUrl: './viewer-poli.component.html',
  styleUrls: ['./viewer-poli.component.scss']
})
export class ViewerPoliComponent implements OnInit {
  dateNow: any = new Date()
  jamSekarang: any;
  isLogin: boolean = true
  poliPanggilNya: string
  antrianPanggilNya: string
  poliYangDipanggil:string
  antrianYangDipanggil:string
  tgl: any;
  apiTimer: any;
  listAntri: any[] = []
  audio = new Audio();
  dipanggil: boolean = false;
  sound: any = null
  listLoket: any[] = []
  color: any[] = ['badge-light-primary', 'badge-light-info', 'badge-light-warning', 'badge-light-success', 'badge-light-danger', 'badge-light-primary', 'badge-light-info', 'badge-light-warning', 'badge-light-success', 'badge-light-danger']
  videoSource: any[] = [
    {
      name: 'LOKAL', url: "http://wpc.d1627.nucdn.net:80/80D1627/o-tvri/Content/HLS/Live/Channel(TVRINASIONAL)/Stream(03)/index.m3u8",
      type: 'dpHls'
    },
    // {
    //   name: 'TRANS 7', url: "assets/tv/playlist.m3u8",
    //   // 'https://video.detik.com/trans7/smil:trans7.smil/playlist.m3u',
    //   type: 'dpHls'
    // },
    { name: 'CNN', url: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/playlist.m3u', type: 'dpHls' },
    { name: 'TVRI', url: 'http://wpc.d1627.nucdn.net:80/80D1627/o-tvri/Content/HLS/Live/Channel(TVRINASIONAL)/Stream(03)/index.m3u8', type: 'dpHls' },
    { name: 'SCTV', url: 'http://210.210.155.35/qwr9ew/s/s03/02.m3u8', type: 'dpFlv' },
    { name: 'Kompas', url: 'http://103.130.186.138:8800/oxygenplay/kompastv/index.m3u8', type: 'dpFlv' },
    { name: 'ANTV', url: 'http://210.210.155.35/qwr9ew/s/s07/02.m3u8', type: 'dpFlv' },
    { name: 'Net TV', url: 'http://210.210.155.35/qwr9ew/s/s08/01.m3u8', type: 'dpFlv' },
    { name: 'Indosiar', url: 'http://210.210.155.35/qwr9ew/s/s04/02.m3u8', type: 'dpFlv' },

  ]
  isVoiceBrowser: boolean = false
  item: any = {
    channel: this.videoSource[0]
  }
  pilihVideo: any
  // videoSource: any
  videoItems = [
    {
      name: 'Video one',
      src: 'https://video.detik.com/trans7/smil:trans7.smil/playlist.m3u',
      type: 'application/x-mpegURL'
    },
    {
      name: 'Video one',
      src: 'https://video.detik.com/trans7/smil:trans7.smil/playlist.m3u',
      type: 'application/x-mpegURL'
    },
  ];
  activeIndex = 0;
  currentVideo = this.videoItems[this.activeIndex];
  data;
  api: any
  popUp: boolean
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  $player: HTMLAudioElement;
  state: StreamState
  files: Array<any> = [];
  jmlLoket = 4
  currentFile: any = { index: -1 };
  listRuangan: any[]
  listFotoDokter: any[]
  sub: any;
  listRuanganAktif: any[] = []
  paramRuang: any
  safeURL: any
  videoURL: string =  "https://www.youtube.com/embed/D2XeXZQz6js?playlist=D2XeXZQz6js&autoplay=1&mute=1&loop=1&rel=0&controls=0&showinfo=0";
//   videoURL: string = 'https://www.youtube.com/embed/avAZ7Hz-dyE?autoplay=1&mute=1'
  numberss = Array(6).map((x, i) => i);
  listSkele: any = []
  namaProfile = Config.getProfile().namaProfile
  constructor(private socket: SocketService,
    private notif: NotificationService,
    private apiService: ApiService,
    private DPService: DPlayerService,
    public audioService: ApiService,
    private route: ActivatedRoute,
    private _sanitizer: DomSanitizer

  ) {
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
    this.apiService.get('viewer/get-setting-viewer').subscribe(e => {
      this.listRuangan = e.ruangan
      this.paramRuang = ''
      this.listRuanganAktif = []
      this.route.params.subscribe(params => {
        // Defaults to 0 if no query param provided.
        let ru = params['ruanganid'];
        if (ru == '-') {

          this.listRuanganAktif = []
          for (let i = 0; i < 6; i++) {
            this.paramRuang = this.paramRuang + ',' + this.listRuangan[i].id
            this.paramRuang = this.paramRuang.substring(1, this.paramRuang.length)
            this.listRuanganAktif.push({
              'namaruangan': this.listRuangan[i].namaruangan,
              'nocounter': this.listRuangan[i].nocounter != null ? this.listRuangan[i].nocounter : 12,
              'noantri': '-'
            })
          }
        } else if (ru == 'all') {
          this.paramRuang = ru
          this.listRuanganAktif = []
          for (let i = 0; i < this.listRuangan.length; i++) {
            this.listRuanganAktif.push({
              'namaruangan': this.listRuangan[i].namaruangan,
              'nocounter': this.listRuangan[i].nocounter != null ? this.listRuangan[i].nocounter : 12,
              'noantri': '-'
            })
          }
        } else {
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
        }
        var jml = this.numberss.length - this.listRuanganAktif.length
        if (jml > 0) {
          this.listSkele = Array(jml).map((x, i) => i);
        }

        if (this.paramRuang == undefined) return
        // this.apiService.get('viewer/get-dipanggil?ruangan=' + this.paramRuang).subscribe(res => {
        //   if (res.namapasien != undefined) {
        //     let ruangan = ''
        //     for (let i = 0; i < this.listRuangan.length; i++) {
        //       const element = this.listRuangan[i];
        //       if (element.id == res.objectruanganfk) {
        //         ruangan = element.namaruangan
        //         break
        //       }
        //     }
        //     this.item.antriTerakhir = res.noantrian
        //     this.item.namapasien = res.nocm + ',' + res.namapasien
        //     this.item.poliPanggil = ruangan
        //     this.dipanggil = true
        //     this.playAudio('Nomor Antrian ' + Terbilang(res.noantrian)
        //       + '. ' + res.namapasien
        //       + '. Ke Ruang.' + ruangan);

        //   }
        // })
        this.apiService
          .get(`viewer/get-data-status-pelayanan?ruangid=${ru}`)
          .subscribe((e) => {
            if (e && e.length > 0) {
              const data = e[0];
              this.item.sudahDilayani = data.sudahdilayani;
              this.item.belumDilayani = data.belumdilayani;
          }
            console.log(e);
          });
      });
    })



    this.socket.on('tampilkan-antrian-poli', (data: any) => {


      let result = JSON.parse(data)
      console.log(result)
      let namaloket = ''
      var status = false
      this.listAntri.push({ noantri: result.noantri, namaruangan: result.namaruangan, namapasien: result.namapasien, nocm: result.nocm, namadokter: result.namadokter, iddokter: result.iddokter})
      if (this.listAntri.length > 0) {

        status = false
        for (let x = 0; x < this.listRuanganAktif.length; x++) {
          const element2 = this.listRuanganAktif[x];
          if (element2.namaruangan == result.namaruangan) {
            status = true
            this.apiService
            .get(`viewer/get-fotodokter-viewer?idPegawai=${this.listAntri[this.listAntri.length - 1].iddokter}`)
            .subscribe((result) => {
            // console.log(result)
            if (result) {
              const base64Image = result.photo;  
              this.item.listFotoDokter = `${base64Image}`;
              element2.fotoDokter = this.item.listFotoDokter 
            }
            });
            element2.noantri = this.listAntri[this.listAntri.length - 1].noantri
            element2.namadokter = this.listAntri[this.listAntri.length - 1].namadokter
            element2.namapasien = this.listAntri[this.listAntri.length - 1].namapasien

            this.item.poliPanggil = this.listAntri[this.listAntri.length - 1].namaruangan
            this.item.antriTerakhir = this.listAntri[this.listAntri.length - 1].noantri
            // this.item.nama = this.listAntri[this.listAntri.length - 1].namapasien
            // this.item.namapasien = this.listAntri[this.listAntri.length - 1].nocm + ',' + this.listAntri[this.listAntri.length - 1].namapasien
            let nama = this.listAntri[this.listAntri.length - 1].namapasien.split('-')
            this.item.namapasien = nama[0]
            this.item.namadokter = this.listAntri[this.listAntri.length - 1].namadokter
          }
        }
      }

      if (status == true) {

        this.dipanggil = true
        if (this.item.poliPanggil === 'POLIKLINIK JIWA' || this.item.poliPanggil === 'Poliklinik Umum' ||
            this.item.poliPanggil === 'Ruang psikiater 1' || this.item.poliPanggil === 'Ruang psikiater 2' ||
            this.item.poliPanggil === 'Ruang psikiater 3' || this.item.poliPanggil === 'Ruang psikiater 4' ||
            this.item.poliPanggil === 'Ruang psikiater 5' || this.item.poliPanggil === 'Ruang psikiater 6' 
          ) {
          this.sound = new Howl({
            src: ['assets/sound/in.wav'],  // Ganti dengan path file suara lonceng Anda
            autoplay: true
          });

          this.item.antrianYangDipanggil = this.item.antriTerakhir
          this.item.poliYangDipanggil = this.item.poliPanggil

          this.dipanggil = false
      
        } else {
      
          if (result.jenis != undefined && result.jenis == 'penunjang') {
            this.playAudio('Nomor Registrasi ' + this.item.antriTerakhir
              //+ '. ' + this.item.nama
              + '. Ke Ruang. ' + this.item.poliPanggil,this.item.poliPanggil,this.item.antriTerakhir);
          } else {
            this.playAudio('Nomor Antrian ' + Terbilang(this.item.antriTerakhir) + '. Silahkan Ke. ' + this.item.poliPanggil, this.item.poliPanggil,this.item.antriTerakhir);
          }
      }
    }
    });

    this.apiTimer = setInterval(() => {
      this.getdate()
    }, (1000)); //1 second
  }


  loadInCaller() {
    this.socket.emit('load-caller', { deskripsi: 'Load Data Di Caller Antrian' });
  }

  ngOnInit(): void {
    this.loadAwal()
    if ('speechSynthesis' in window) {
      console.log('Text-to-speech on.');
    } else {
      console.log('Text-to-speech not supported.');
    }
    if (localStorage.getItem('urlVideo') != null) {
      // for (let i = 0; i < this.videoSource.length; i++) {
      //   const element = this.videoSource[i];
      //   if (element.url == localStorage.getItem('urlVideo')) {
      //     this.pilihVideo = localStorage.getItem('urlVideo')
      //   } else {
      //     this.item.url = localStorage.getItem('urlVideo')
      //     this.pilihVideo = localStorage.getItem('urlVideo')
      //   }
      // }
      this.videoURL = localStorage.getItem('urlVideo') + '?autoplay=1&mute=1'
    } else {
      // this.pilihVideo = this.videoSource[0].url
    }
    // for (let i = 0; i < this.videoSource.length; i++) {
    //   const element = this.videoSource[i];
    //   if (element.url == this.pilihVideo) {
    //     this.item.channel = element
    //     break
    //   }
    // }

    // Panggil fungsi untuk memulai interval load data
    this.setupPeriodicLoad();

  }
  setNumberStr(nomer) {
    var str = "" + nomer
    var pad = "000"
    var ans = pad.substring(0, pad.length - str.length) + str
    return ans;
  }
  loadAwal() {
    // let namaloket = ''
    // this.apiService.get('viewer/get-data-viewer').subscribe(e => {
    //   if (e.length > 0) {
    //     for (let i = 0; i < e.length; i++) {
    //       const element = e[i];
    //       if (i == 0) {
    //         this.item.antriTerakhir = element.jenis + '-' + this.setNumberStr(element.noantrian)
    //         this.item.loketPanggil = 'Loket ' + element.tempatlahir
    //       }
    //       for (let x = 0; x < this.listLoket.length; x++) {
    //         const element2 = this.listLoket[x];
    //         if (element2.id == element.tempatlahir) {
    //           element2.value = element.jenis + '-' + this.setNumberStr(element.noantrian)
    //         }
    //       }


    //     }
    //     console.log(this.listLoket)
    //   }
    // })
  }

  setupPeriodicLoad() {
    // Langsung memanggil API di awal
    this.loadDataStatusPelayanan();

    // Interval untuk memuat data setiap 3 detik
    setInterval(() => {
      this.loadDataStatusPelayanan();
        // }, 3000); // 3000 ms = 3 detik
        // }, 120000); // 120000 ms = 2 menit
    }, 30000); // 30000 ms = 30 detik
  }

  loadDataStatusPelayanan() {
    if (this.paramRuang === undefined) return;

    this.apiService
      .get(`viewer/get-data-status-pelayanan?ruangid=${this.paramRuang}`)
      .subscribe((e) => {
        if (e && e.length > 0) {
          const data = e[0];
          this.item.sudahDilayani = data.sudahdilayani;
          this.item.belumDilayani = data.belumdilayani;
        }
        console.log(e);
      });
  }

  replaceGelar(nomor: string) : string {
    return nomor.
    replace(/\.M/g, ' .M').
    replace(/\.S/g, ' .S').
    replace(/ RUANG PERAWAT\. /g,' nurse station ').
    replace(/ dr\. /g,' Dokter. ').
    replace(/ H\. /ig,' Haji. ').
    replace(/ HJ\. /ig,' Hajjah. ').
    replace(/ IR\. /ig,' Insinyur. ').
    replace(/ A\.MD\. /ig,' Ahli Madya. ').
    replace(/ PROF\. /ig,' Professor. ').
    replace(/ DR\. /ig,' Doktor. ').
    replace(/ S\.T\. /ig,' Sarjana Tehnik. ').
    replace(/ ST\./g, ' Sarjana Tehnik. ').
    replace(/ M\.T\. /ig,' Magister Tehnik. ').
    replace(/ S\.H\. /ig,' Sarjana Hukum. ').
    replace(/ SH\. /ig,' Sarjana Hukum. ').
    replace(/ M\.H\. /ig,' Magister Hukum. ').
    replace(/ S\.SI\. /ig,' Sarjana Sain. ').
    replace(/ M.SI\. /ig,' Magister Sain. ').
    replace(/ S\.PD\. /ig,' Sarjana Pendidikan. ').
    replace(/ M.PD\. /ig,' Magister Pendidikan. ').
    replace(/ SE\. /ig,' Sarjana Ekonomi. ').
    replace(/ S\.E\. /ig,' Sarjana Ekonomi. ').
    replace(/ S.MN\. /ig,' Sarjana Manajemen. ').
    replace(/ S.MB\. /ig,' Sarjana Manajemen Bisnis. ').
    replace(/ PH\.D\. /ig,' Doktor of Filosofi. ').
    replace(/ TN\. /ig,' Tuan. ').
    replace(/ NY\. /ig,' Nyonya. ').
    replace(/ NN\. /ig,' Nona. ').
    replace(/ AN\. /ig,' ').
    replace(/ DRS\. /ig,' Doktorandus. ')
  }



  playAudio(nomor: string, poliPanggilNya:string, antrianPanggilNya:string) {

    // setTimeout(() => {

  
    
    var synthesis = window.speechSynthesis;
    // Get the first `en` language voice in the list
    
    var voice = synthesis.getVoices().filter(function (voice) {
      return voice.lang === 'id-ID';
    })[0];
    
    // Create an utterance object
    var utterance = new SpeechSynthesisUtterance(this.replaceGelar(nomor).
    toLocaleLowerCase());
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
    // }, (1500)); //4 detik
    // setTimeout(() => {
      
    // }, (4000));
    setTimeout(() => {
      
      this.item.poliYangDipanggil = poliPanggilNya
      this.item.antrianYangDipanggil = antrianPanggilNya
      this.dipanggil = false
    }, (5000));

  }

  getdate() {
    var today = new Date();
    var h: any = today.getHours();
    var m: any = today.getMinutes();
    var s: any = today.getSeconds();
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }

    var months: any = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var myDays: any = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    var date: any = new Date();
    var day: any = date.getDate();
    var month: any = date.getMonth();
    var thisDay: any = date.getDay(),
      thisDay = myDays[thisDay];
    var yy: any = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;

    var tgl = (thisDay + ', ' + day + ' ' + months[month] + ' ' + year);
    var jam = (h + ":" + m + ":" + s + " WIB");
    // $("#timer").html(tgl + ' ' + jam);
    // setTimeout(function () {this.getdate() }, 1000);
    var el: HTMLElement = document.getElementById('timer');

    this.jamSekarang = jam
    this.tgl = tgl
    // console.log(this.jamSekarang)
  }

  onResize() {
    console.log('resize');
  }
  private clickTimeout = null;
  public showPop(): void {
    if (this.clickTimeout) {
      this.setClickTimeout(() => {
        this.handleDoubleClick()
      });
    } else {
      // if timeout doesn't exist, we know it's first click
      // treat as single click until further notice
      this.setClickTimeout(() =>
        this.handleSingleClick()
      );
    }
  }
  // sets the click timeout and takes a callback
  // for what operations you want to complete when
  // the click timeout completes
  public setClickTimeout(callback) {
    // clear any existing timeout
    clearTimeout(this.clickTimeout);
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = null;
      callback();
    }, 200);
  }
  public handleSingleClick() {
    //  alert('sa')
  }
  public handleDoubleClick() {
    this.popUp = true
  }
  save(player) {
    // if (this.item.url != undefined && this.item.url != '') {
    //   this.pilihVideo = this.item.url
    // } else {
    //   this.pilihVideo = this.item.channel.url
    // }
    // this.videoURL =
    this.popUp = false
    localStorage.setItem('urlVideo', this.videoURL)
    // var isss = ''
    // if (this.isVoiceBrowser) {
    //   isss = 'true'
    // } else {
    //   isss = 'false'
    // }
    // localStorage.setItem('isVoiceBrowser', isss)
    window.location.reload()

  }
  // onloadStart(player){
  //   player.pause();
  //   console.log(player)
  // }
  fullScreen() {
    let elem = document.documentElement;
    let methodToBeInvoked = elem.requestFullscreen ||
      elem['mozRequestFullscreen']
      ||
      elem['msRequestFullscreen'];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }
}
