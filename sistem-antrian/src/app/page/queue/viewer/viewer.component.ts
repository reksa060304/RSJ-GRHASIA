import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { DPlayerService } from 'angular-dplayer';
import { ApiService } from 'src/app/service';
import { NotificationService } from 'src/app/service/notification.service';
import { SocketService } from 'src/app/service/socket.service';
import Terbilang from 'terbilang-ts'
@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  dateNow: any = new Date()
  jamSekarang: any;
  apiTimer: any;
  listAntri: any[] = []
  audio = new Audio();
  dipanggil: boolean = false;
  videoSource: any[] = [
    { name: 'TRANS 7', url: 'https://video.detik.com/trans7/smil:trans7.smil/playlist.m3u', type: 'dpHls' },
    { name: 'CNN', url: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/playlist.m3u', type: 'dpHls' },
    { name: 'TVRI', url: 'http://wpc.d1627.nucdn.net:80/80D1627/o-tvri/Content/HLS/Live/Channel(TVRINASIONAL)/Stream(03)/index.m3u8', type: 'dpHls' },
    { name: 'SCTV', url: 'http://210.210.155.35/qwr9ew/s/s03/02.m3u8', type: 'dpFlv' },
    { name: 'Kompas', url: 'http://103.130.186.138:8800/oxygenplay/kompastv/index.m3u8', type: 'dpFlv' },
    { name: 'ANTV', url: 'http://210.210.155.35/qwr9ew/s/s07/02.m3u8', type: 'dpFlv' },
    { name: 'Net TV', url: 'http://210.210.155.35/qwr9ew/s/s08/01.m3u8', type: 'dpFlv' },
    { name: 'Indosiar', url: 'http://210.210.155.35/qwr9ew/s/s04/02.m3u8', type: 'dpFlv' },

  ]
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
  // '	https://iptv-org.github.io/iptv/categories/music.m3u'
  constructor(private socket: SocketService,
    private notif: NotificationService,
    private apiService: ApiService,
    private DPService: DPlayerService) {
    this.audio.src = "assets/sound/in.wav";
    this.audio.load();
    this.socket.on('tampilkan', (data: any) => {
      let result = JSON.parse(data)
      let namaloket = ''
      this.listAntri.push({ no: result.no, loket: result.loket })
      if (this.listAntri.length > 0) {
        this.item.antriTerakhir = this.listAntri[this.listAntri.length - 1].no
        this.item.loketPanggil = 'Loket ' + this.listAntri[this.listAntri.length - 1].loket

        if (result.loket == 1) {
          this.item.antriLoket1 = this.listAntri[this.listAntri.length - 1].no
          namaloket = 'Satu'
        }
        if (result.loket == 2) {
          this.item.antriLoket2 = this.listAntri[this.listAntri.length - 1].no
          namaloket = 'Dua'
        }
        if (result.loket == 3) {
          this.item.antriLoket3 = this.listAntri[this.listAntri.length - 1].no
          namaloket = 'Tiga'
        }
        if (result.loket == 4) {
          this.item.antriLoket4 = this.listAntri[this.listAntri.length - 1].no
          namaloket = 'Empat'
        }
        if (result.loket == 5) {
          this.item.antriLoket5 = this.listAntri[this.listAntri.length - 1].no
          namaloket = 'Lima'
        }
      }
      let nomor = this.listAntri[this.listAntri.length - 1].no
      nomor = nomor.toString().split('-')
      this.dipanggil = true
      this.audio.play();

      this.playAudio('Nomor Antrian ' + nomor[0] + ' ' + Terbilang(nomor[1])
        + ' Ke Loket ' + namaloket);
      this.loadInCaller()
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
        for (let i = 0; i < this.videoSource.length; i++) {
          const element = this.videoSource[i];
          if(element.url == localStorage.getItem('urlVideo')){
             this.pilihVideo = localStorage.getItem('urlVideo')
           }else{
             this.item.url =localStorage.getItem('urlVideo')
             this.pilihVideo = localStorage.getItem('urlVideo')
           }
        }
     
    } else {
      this.pilihVideo = this.videoSource[0].url
    }
    for (let i = 0; i < this.videoSource.length; i++) {
      const element = this.videoSource[i];
      if (element.url == this.pilihVideo) {
        this.item.channel = element
        break
      }
    }

  }
  setNumberStr(nomer) {
    var str = "" + nomer
    var pad = "000"
    var ans = pad.substring(0, pad.length - str.length) + str
    return ans;
  }
  loadAwal() {
    let namaloket = ''
    this.apiService.get('viewer/get-data-viewer').subscribe(e => {
      if (e.length > 0) {
        for (let i = 0; i < e.length; i++) {
          const element = e[i];
          if (i == 0) {
            this.item.antriTerakhir = element.jenis + '-' + this.setNumberStr(element.noantrian)
            this.item.loketPanggil = 'Loket ' + element.tempatlahir
          }
          if (element.tempatlahir == 1) {
            this.item.antriLoket1 = element.jenis + '-' + this.setNumberStr(element.noantrian)
            namaloket = 'Satu'
          }
          if (element.tempatlahir == 2) {
            this.item.antriLoket2 = element.jenis + '-' + this.setNumberStr(element.noantrian)
            namaloket = 'Dua'
          }
          if (element.tempatlahir == 3) {
            this.item.antriLoket3 = element.jenis + '-' + this.setNumberStr(element.noantrian)
            namaloket = 'Tiga'
          }
          if (element.tempatlahir == 4) {
            this.item.antriLoket4 = element.jenis + '-' + this.setNumberStr(element.noantrian)
            namaloket = 'Empat'
          }
          if (element.tempatlahir == 5) {
            this.item.antriLoket5 = element.jenis + '-' + this.setNumberStr(element.noantrian)
            namaloket = 'Lima'
          }
        }
      }
    })
  }
  // update() {
  //   this.apiService.get('viewer/get-list-antrian').subscribe(e => {
  //     // this.dataTable = e.data
  //     this.item.no = e.last
  //   })
  // }
  playAudio(nomor) {

    setTimeout(() => {

      var synthesis = window.speechSynthesis;
      // Get the first `en` language voice in the list
      var voice = synthesis.getVoices().filter(function (voice) {
        return voice.lang === 'id-ID';
      })[0];
      // Create an utterance object
      var utterance = new SpeechSynthesisUtterance(nomor);
      // Set utterance properties 
      utterance.voice = voice;
      // utterance.lang  = 'id-ID';
      // utterance.text = document.querySelector("textarea").value;
      // utterance.pitch = 1.0;
      utterance.rate = 0.6;
      // utterance.volume = 0.8;
      // Speak the utterance
      synthesis.speak(utterance);
    
    }, (1500)); //4 detik
    setTimeout(() => {
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
    var jam = (h + ":" + m + ":" + s + " wib");
    // $("#timer").html(tgl + ' ' + jam);
    // setTimeout(function () {this.getdate() }, 1000);
    var el: HTMLElement = document.getElementById('timer');

    this.jamSekarang = tgl + ' ' + jam
    // console.log(this.jamSekarang)
  }
  // videoPlayerInit(api: VgApiService) {
  //   this.api = api;
  //   this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(
  //     this.playVideo.bind(this)
  //   );
  // }

  // playVideo() {
  //   this.api.play();
  // }
  // nextVideo() {
  //   this.activeIndex++;

  //   if (this.activeIndex === this.videoItems.length) {
  //     this.activeIndex = 0;
  //   }

  //   this.currentVideo = this.videoItems[this.activeIndex];
  // }

  // initVdo() {
  //   this.data.play();
  // }

  // startPlaylistVdo(item, index: number) {
  //   this.activeIndex = index;
  //   this.currentVideo = item;
  // }
  // toggleVideo() {
  //   this.videoplayer.nativeElement.play();
  // }
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
    if(this.item.url !=undefined && this.item.url!=''){
         this.pilihVideo = this.item.url
      }else{
         this.pilihVideo = this.item.channel.url
      }
  
    this.popUp = false
    localStorage.setItem('urlVideo', this.pilihVideo)
    window.location.reload()
    // this.DPService._dp[0].dp.options.video.url= this.item.channel.url
    // console.log(this.DPService)
    // this.onloadStart(player)
  }
  // onloadStart(player){
  //   player.pause();
  //   console.log(player)
  // }
}
