

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { DPlayerService } from 'angular-dplayer';
import { StreamState } from 'src/app/interfaces/stream-state';
import { ApiService } from 'src/app/service';
import { NotificationService } from 'src/app/service/notification.service';
import { SocketService } from 'src/app/service/socket.service';
import Terbilang from 'terbilang-ts'
import { Howl, Howler } from 'howler';
import { Config } from 'src/app/guard';
@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  dateNow: any = new Date()
  jamSekarang: any;
  isLogin:boolean =true
  tgl: any;
  apiTimer: any;
  listAntri: any[] = []
  audio = new Audio();
  dipanggil: boolean = false;
  sound: any = null
  listLoket: any[] = []
  namaProfile = Config.getProfile().namaProfile
  color: any[] = ['badge-light-primary', 'badge-light-info', 'badge-light-warning', 'badge-light-success', 'badge-light-danger', 'badge-light-primary', 'badge-light-info', 'badge-light-warning', 'badge-light-success', 'badge-light-danger']
  videoSource: any[] = [
    // {
    //   name: 'LOKAL', url: "assets/tv/jasmed.mp4",
    //   // 'https://video.detik.com/trans7/smil:trans7.smil/playlist.m3u', 
    //   type: 'dpHls'
    // },
    // {
    //   name: 'TRANS 7', url: "assets/tv/playlist.m3u8",
    //   // 'https://video.detik.com/trans7/smil:trans7.smil/playlist.m3u', 
    //   type: 'dpHls'
    // },
    { name: 'CNN', url: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/playlist.m3u', type: 'dpHls' },
    { name: 'TVRI', url: 'https://cors-anywhere.herokuapp.com/http://wpc.d1627.nucdn.net:80/80D1627/o-tvri/Content/HLS/Live/Channel(TVRINASIONAL)/Stream(03)/index.m3u8', type: 'dpHls' },
    { name: 'SCTV', url: 'https://cors-anywhere.herokuapp.com/http://210.210.155.35/qwr9ew/s/s03/02.m3u8', type: 'dpFlv' },
    { name: 'Kompas', url: 'https://cors-anywhere.herokuapp.com/http://103.130.186.138:8800/oxygenplay/kompastv/index.m3u8', type: 'dpFlv' },
    { name: 'ANTV', url: 'https://cors-anywhere.herokuapp.com/http://210.210.155.35/qwr9ew/s/s07/02.m3u8', type: 'dpFlv' },
    { name: 'Net TV', url: 'https://cors-anywhere.herokuapp.com/http://210.210.155.35/qwr9ew/s/s08/01.m3u8', type: 'dpFlv' },
    { name: 'Indosiar', url: 'https://cors-anywhere.herokuapp.com/http://210.210.155.35/qwr9ew/s/s04/02.m3u8', type: 'dpFlv' },

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
  safeURL: any

  constructor(private socket: SocketService,
    private notif: NotificationService,
    private apiService: ApiService,
    private DPService: DPlayerService,

    public audioService: ApiService,
  ) {

    this.safeURL = 'http://'+window.location.hostname+'/service/rsjp-materi.mp4';
    // this.apiService.getJSON('sep').subscribe(e => {

    // })

    this.apiService.get('sysadmin/settingdatafixed/get/jumlahLoket').subscribe(e => {
      this.jmlLoket = parseInt(e)
      for (let x = 0; x < this.jmlLoket; x++) {
        const element = this.jmlLoket[x];
        this.listLoket.push({
          label: 'Loket ' + (x + 1),
          value: '-',
          id: x + 1
        })
      }
    })

    if (localStorage.getItem('isVoiceBrowser') != null) {
      if (localStorage.getItem('isVoiceBrowser') == 'true') {
        this.isVoiceBrowser = true
      } else {
        this.isVoiceBrowser = false
      }
    }
    if (this.isVoiceBrowser == true) {
      this.socket.on('tampilkan', (data: any) => {
        let result = JSON.parse(data)
        let namaloket = ''
        this.audio.play();
        this.listAntri.push({ no: result.no, loket: result.loket })
        if (this.listAntri.length > 0) {
          this.item.loketPanggil = 'Loket ' + this.listAntri[this.listAntri.length - 1].loket
          this.item.antriTerakhir = this.listAntri[this.listAntri.length - 1].no
          namaloket =  this.listAntri[this.listAntri.length - 1].loket
          for (let x = 0; x < this.listLoket.length; x++) {
            const element2 = this.listLoket[x];
            if (element2.id == result.loket) {
              element2.value = this.listAntri[this.listAntri.length - 1].no
            }
          }

        }
        let nomor = this.listAntri[this.listAntri.length - 1].no
        nomor = nomor.toString().split('-')
        this.dipanggil = true


        this.playAudio('Nomor Antrian ' + nomor[0] + ' ' + Terbilang(nomor[1])
          + ' Ke Loket ' + namaloket);

        this.loadInCaller()
      });
    } else {
      this.socket.on('tampilkan', (data: any) => {

        let result = JSON.parse(data)
        let namaloket = ''

        let angka: any
        let jenis: any
        let loket: any
        let namaSoundAngka: any
        this.listAntri.push({ no: result.no, loket: result.loket })
        if (this.listAntri.length > 0) {
          this.item.loketPanggil = 'Loket ' + this.listAntri[this.listAntri.length - 1].loket
          this.item.antriTerakhir = this.listAntri[this.listAntri.length - 1].no
          for (let x = 0; x < this.listLoket.length; x++) {
            const element2 = this.listLoket[x];
            if (element2.id == result.loket) {
              element2.value = this.listAntri[this.listAntri.length - 1].no
            }
          }

          let nomor = this.listAntri[this.listAntri.length - 1].no
          nomor = nomor.toString().split('-')


          jenis = this.item.antriTerakhir.split('-')[0]
          loket = this.listAntri[this.listAntri.length - 1].loket

          if (this.dipanggil == true) {
            this.dipanggil = false
            if (this.sound != null) {
              this.sound.stop();
              this.sound.unload();
              this.sound = null;
            }
          }
          this.dipanggil = true
          this.sound = new Howl({
            src: ['assets/sound/in.wav'],
            autoplay: true,
            onend: () => {
              this.sound = new Howl({
                src: ['assets/sound/nomorantrian.mp3'],
                autoplay: true,
                onend: () => {
                  this.sound = new Howl({
                    src: ['assets/sound/' + jenis + '.mp3'],
                    autoplay: true,
                    onend: () => {
                      angka = parseInt(this.item.antriTerakhir.split('-')[1])
                      namaSoundAngka = ''
                      var cariNol = this.item.antriTerakhir.includes("00");
                      if (cariNol == true) {
                        namaSoundAngka = '00'
                      } else {
                        var cariNol2 = this.item.antriTerakhir.includes("0");
                        if (cariNol2 == true) {
                          namaSoundAngka = '0'
                        }
                      }




                      namaloket = 'Loket ' + this.listAntri[this.listAntri.length - 1].loket

                      let belas = false
                      let puluh = false
                      let ratus = false

                      if (angka > 199 && angka < 1000) ratus = true
                      if (angka > 99 && angka < 200) {
                        namaSoundAngka = 'seratus'
                        angka = angka - 100
                      }
                      if (angka > 19 && angka < 100) puluh = true

                      if (angka < 20 && angka > 11) {
                        angka = angka - 10
                        belas = true
                      }

                      if (angka.toString().length == 2 && angka == 10) {
                        namaSoundAngka += ' sepuluh'
                        namaSoundAngka = namaSoundAngka.trim()
                        namaSoundAngka = namaSoundAngka.split(' ')
                        if (namaSoundAngka.length == 1) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                            autoplay: true,
                            onend: () => {
                              this.goLoket(loket)
                            }
                          });
                        }
                        if (namaSoundAngka.length == 2) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                            autoplay: true,
                            onend: () => {
                              this.sound = new Howl({
                                src: ['assets/sound/' + namaSoundAngka[1] + '.mp3'],
                                autoplay: true,
                                onend: () => {
                                  this.goLoket(loket)
                                }
                              });

                            }
                          });
                        }
                        if (namaSoundAngka.length == 3) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                            autoplay: true,
                            onend: () => {
                              this.sound = new Howl({
                                src: ['assets/sound/' + namaSoundAngka[1] + '.mp3'],
                                autoplay: true,
                                onend: () => {
                                  this.sound = new Howl({
                                    src: ['assets/sound/' + namaSoundAngka[2] + '.mp3'],
                                    autoplay: true,
                                    onend: () => {
                                      this.goLoket(loket)
                                    }
                                  });
                                }
                              });

                            }
                          });
                        }


                        return
                      }
                      if (angka.toString().length == 2 && angka == 11) {
                        namaSoundAngka += ' sebelas'
                        namaSoundAngka = namaSoundAngka.trim()
                        namaSoundAngka = namaSoundAngka.split(' ')
                        if (namaSoundAngka.length == 1) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                            autoplay: true,
                            onend: () => {
                              this.goLoket(loket)
                            }
                          });
                        }
                        if (namaSoundAngka.length == 2) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                            autoplay: true,
                            onend: () => {
                              this.sound = new Howl({
                                src: ['assets/sound/' + namaSoundAngka[1] + '.mp3'],
                                autoplay: true,
                                onend: () => {
                                  this.goLoket(loket)
                                }
                              });

                            }
                          });
                        }
                        if (namaSoundAngka.length == 3) {
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                            autoplay: true,
                            onend: () => {
                              this.sound = new Howl({
                                src: ['assets/sound/' + namaSoundAngka[1] + '.mp3'],
                                autoplay: true,
                                onend: () => {
                                  this.sound = new Howl({
                                    src: ['assets/sound/' + namaSoundAngka[2] + '.mp3'],
                                    autoplay: true,
                                    onend: () => {
                                      this.goLoket(loket)
                                    }
                                  });
                                }
                              });

                            }
                          });
                        }


                        return
                      }
                      if (angka.toString().length == 3 && angka == 100) {
                        namaSoundAngka = 'seratus'
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka + '.mp3'],
                          autoplay: true,
                          onend: () => {
                            this.goLoket(loket)
                          }
                        });
                        return
                      }


                      if (angka.toString().length == 4 && angka == 1000) {
                        namaSoundAngka = 'seribu'
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka + '.mp3'],
                          autoplay: true,
                          onend: () => {
                            this.goLoket(loket)
                          }
                        });
                        return
                      }

                      for (let i = 0; i < angka.toString().length; i++) {

                        if (ratus == false && angka > 200 && (parseInt(angka.toString().substr(1, 2)) == NaN ? 0 : parseInt(angka.toString().substr(1, 2))) == 10) {
                          namaSoundAngka += 'sepuluh'
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka + '.mp3'],
                            autoplay: true,
                            onend: () => {
                              this.goLoket(loket)
                            }
                          });
                        }

                        if (ratus == false && angka > 200 && (parseInt(angka.toString().substr(1, 2)) == NaN ? 0 : parseInt(angka.toString().substr(1, 2))) == 11) {
                          namaSoundAngka += 'sebelas'
                          this.sound = new Howl({
                            src: ['assets/sound/' + namaSoundAngka + '.mp3'],
                            autoplay: true,
                            onend: () => {
                              this.goLoket(loket)
                            }
                          });

                        }
                        if (ratus == false && angka > 200) {
                          if ((parseInt(angka.toString().substr(1, 2)) == NaN ? 0 : parseInt(angka.toString().substr(1, 2))) > 19 && puluh == false) {
                            puluh = true
                          } else {
                            puluh = false
                          }
                        }
                        if (ratus == false && angka > 200
                          && (parseInt(angka.toString().substr(1, 2)) == NaN ? 0 : parseInt(angka.toString().substr(1, 2))) < 20
                          && (parseInt(angka.toString().substr(1, 2)) == NaN ? 0 : parseInt(angka.toString().substr(1, 2))) > 11) {
                          switch (angka) {
                            case 12:
                              namaSoundAngka += ' 2'
                              namaSoundAngka += ' belas'
                              break;
                            case 13:
                              namaSoundAngka += ' 3'
                              namaSoundAngka += ' belas'
                              break;
                            case 14:
                              namaSoundAngka += ' 4'
                              namaSoundAngka += ' belas'
                              break;
                            case 15:
                              namaSoundAngka += ' 5'
                              namaSoundAngka += ' belas'
                              break;
                            case 16:
                              namaSoundAngka += ' 6'
                              namaSoundAngka += ' belas'
                              break;
                            case 17:
                              namaSoundAngka += ' 7'
                              namaSoundAngka += ' belas'
                              break;
                            case 18:
                              namaSoundAngka += ' 8'
                              namaSoundAngka += ' belas'
                              break;
                            case 19:
                              namaSoundAngka += ' 9'
                              namaSoundAngka += ' belas'
                              break;
                            default:
                          }
                        }
                        switch ((parseInt(angka.toString().substr(i, 1)) == NaN ? 0 : parseInt(angka.toString().substr(i, 1)))) {
                          case 1:
                            namaSoundAngka += ' 1'
                            break;
                          case 2:
                            namaSoundAngka += ' 2'
                            break;
                          case 3:
                            namaSoundAngka += ' 3'
                            break;
                          case 4:
                            namaSoundAngka += ' 4'
                            break;
                          case 5:
                            namaSoundAngka += ' 5'
                            break;
                          case 6:
                            namaSoundAngka += ' 6'
                            break;
                          case 7:
                            namaSoundAngka += ' 7'
                            break;
                          case 8:
                            namaSoundAngka += ' 8'
                            break;
                          case 9:
                            namaSoundAngka += ' 9'
                            break;
                          default:
                        }

                        if (belas == true) { namaSoundAngka += ' belas' }
                        if (puluh == true) { namaSoundAngka += ' puluh' }
                        if (angka > 19 && angka < 100) { puluh = false }
                        if (ratus == true) {
                          namaSoundAngka += ' ratus'
                          ratus = false
                        }
                      }
                      namaSoundAngka = namaSoundAngka.trim()
                      namaSoundAngka = namaSoundAngka.split(' ')
                      if (namaSoundAngka.length == 1) {
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                          autoplay: true,
                          onend: () => {
                            this.goLoket(loket)
                          }
                        });
                      }
                      if (namaSoundAngka.length == 2) {
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                          autoplay: true,
                          onend: () => {
                            this.sound = new Howl({
                              src: ['assets/sound/' + namaSoundAngka[1] + '.mp3'],
                              autoplay: true,
                              onend: () => {
                                this.goLoket(loket)
                              }
                            });

                          }
                        });
                      }
                      if (namaSoundAngka.length == 3) {
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                          autoplay: true,
                          onend: () => {
                            this.sound = new Howl({
                              src: ['assets/sound/' + namaSoundAngka[1] + '.mp3'],
                              autoplay: true,
                              onend: () => {
                                this.sound = new Howl({
                                  src: ['assets/sound/' + namaSoundAngka[2] + '.mp3'],
                                  autoplay: true,
                                  onend: () => {
                                    this.goLoket(loket)
                                  }
                                });
                              }
                            });

                          }
                        });
                      }
                      if (namaSoundAngka.length == 4) {
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                          autoplay: true,
                          onend: () => {
                            this.sound = new Howl({
                              src: ['assets/sound/' + namaSoundAngka[1] + '.mp3'],
                              autoplay: true,
                              onend: () => {
                                this.sound = new Howl({
                                  src: ['assets/sound/' + namaSoundAngka[2] + '.mp3'],
                                  autoplay: true,
                                  onend: () => {
                                    this.sound = new Howl({
                                      src: ['assets/sound/' + namaSoundAngka[3] + '.mp3'],
                                      autoplay: true,
                                      onend: () => {
                                        this.goLoket(loket)
                                      }
                                    });
                                  }
                                });
                              }
                            });

                          }
                        });
                      }
                      if (namaSoundAngka.length == 5) {
                        this.sound = new Howl({
                          src: ['assets/sound/' + namaSoundAngka[0] + '.mp3'],
                          autoplay: true,
                          onend: () => {
                            this.sound = new Howl({
                              src: ['assets/sound/' + namaSoundAngka[1] + '.mp3'],
                              autoplay: true,
                              onend: () => {
                                this.sound = new Howl({
                                  src: ['assets/sound/' + namaSoundAngka[2] + '.mp3'],
                                  autoplay: true,
                                  onend: () => {
                                    this.sound = new Howl({
                                      src: ['assets/sound/' + namaSoundAngka[3] + '.mp3'],
                                      autoplay: true,
                                      onend: () => {
                                        this.sound = new Howl({
                                          src: ['assets/sound/' + namaSoundAngka[4] + '.mp3'],
                                          autoplay: true,
                                          onend: () => {
                                            this.goLoket(loket)
                                          }
                                        });
                                      }
                                    });
                                  }
                                });
                              }
                            });

                          }
                        });
                      }

                    }
                  });
                }
              });
            }
          });
        }
        // this.playAudio2(jenis, angka, namaloket);

        this.loadInCaller()
      });
    }




    this.apiTimer = setInterval(() => {
      this.getdate()
    }, (1000)); //1 second
  }

  goLoket(loket) {
    this.sound = new Howl({
      src: ['assets/sound/loket.mp3'],
      autoplay: true,
      onend: () => {
        this.sound = new Howl({
          src: ['assets/sound/' + loket + '.mp3'],
          autoplay: true,
          onend: () => {
            this.dipanggil = false
          }
        });
      }
    });
  }
  // playHowl(url) {
  //   this.sound = new Howl({
  //     src: [url],
  //     autoplay: true,
  //     onload: function () {

  //     },
  //     onplay: function (getSoundId) {
  //       //sound playing
  //     },
  //     onend: () => {

  //     }
  //   });
  //   if (sound.duration) {
  //     setTimeout(() => {
  //       this.playHowl(url)
  //     }, sound.duration * 1000)
  //   }
  // }
  next(files) {
    const index = this.currentFile.index + 1;
    const file = files[index];
    this.openFile(file, index);
  }

  callNext(url) {
    this.audioService.stop();
    this.audioService.playStream(url).subscribe(events2 => {

    })
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.url);
  }
  playStream(url) {
    this.audioService.playStream(url).subscribe(events => {
      // listening for fun here
    });
  }
  playAudio2(jenis, nomor, loket) {


    // dingdong
    let audio = new Audio();
    audio.src = "assets/sound/in.wav";
    audio.load();
    audio.pause();
    audio.currentTime = 0;
    audio.play();


    //SET DELAY UNTUK MEMAINKAN REKAMAN NOMOR URUT
    let totalwaktu = 2 * 1000;

    // let audio2 = new Audio();
    // audio2.src = "assets/sound/" + jenis + ".mp3";
    // audio2.load();
    // audio2.pause();
    // audio2.currentTime = 0;
    // audio2.play();

    // let audio3 = new Audio();
    // audio3.src = "assets/sound/" + nomor + ".mp3";
    // audio3.load();
    // audio3.pause();
    // audio3.currentTime = 0;
    // audio3.play();

    // let audio4 = new Audio();
    // audio4.src = "assets/sound/loket.mp3";
    // audio4.load();
    // audio4.pause();
    // audio4.currentTime = 0;
    // audio4.play();



    // let audio5 = new Audio();
    // audio5.src = "assets/sound/" + loket + ".mp3";
    // audio5.load();
    // audio5.pause();
    // audio5.currentTime = 0;
    // audio5.play();


    setTimeout(function () {
      let audio = new Audio();
      audio.src = "assets/sound/nomorantrian.mp3";
      audio.load();
      audio.pause();
      audio.currentTime = 0;
      audio.play();
      totalwaktu = totalwaktu * 3;
    }, totalwaktu);


    setTimeout(function () {
      let audio = new Audio();
      audio.src = "assets/sound/" + jenis + ".mp3";
      audio.load();
      audio.pause();
      audio.currentTime = 0;
      audio.play();
      totalwaktu = totalwaktu * 3;
    }, totalwaktu);


    setTimeout(function () {
      let audio = new Audio();
      audio.src = "assets/sound/" + nomor + ".mp3";
      audio.load();
      audio.pause();
      audio.currentTime = 0;
      audio.play();
      totalwaktu = totalwaktu * 3;
    }, totalwaktu);


    setTimeout(function () {
      let audio = new Audio();
      audio.src = "assets/sound/loket.mp3";
      audio.load();
      audio.pause();
      audio.currentTime = 0;
      audio.play();
      totalwaktu = totalwaktu * 3;
    }, totalwaktu);



    setTimeout(function () {
      let audio = new Audio();
      audio.src = "assets/sound/" + loket + ".mp3";
      audio.load();
      audio.pause();
      audio.currentTime = 0;
      audio.play();
      totalwaktu = totalwaktu * 3;
    }, totalwaktu);

  }
  loadInCaller() {
    this.socket.emit('load-caller', { deskripsi: 'Load Data Di Caller Antrian' });
  }

  ngOnInit(): void {
    // let audio = new Audio();
    // audio.src = "assets/sound/nomorantrian.mp3"
    // audio.load();
    // audio.play();

    this.loadAwal()
    if ('speechSynthesis' in window) {
      console.log('Text-to-speech on.');
    } else {
      console.log('Text-to-speech not supported.');
    }
    if (localStorage.getItem('urlVideo') != null) {
      for (let i = 0; i < this.videoSource.length; i++) {
        const element = this.videoSource[i];
        if (element.url == localStorage.getItem('urlVideo')) {
          this.pilihVideo = localStorage.getItem('urlVideo')
        } else {
          this.item.url = localStorage.getItem('urlVideo')
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
          for (let x = 0; x < this.listLoket.length; x++) {
            const element2 = this.listLoket[x];
            if (element2.id == element.tempatlahir) {
              element2.value = element.jenis + '-' + this.setNumberStr(element.noantrian)
            }
          }

          // if (element.tempatlahir == 1) {
          //   this.item.antriLoket1 = element.jenis + '-' + this.setNumberStr(element.noantrian)
          //   namaloket = 'Satu'
          // }
          // if (element.tempatlahir == 2) {
          //   this.item.antriLoket2 = element.jenis + '-' + this.setNumberStr(element.noantrian)
          //   namaloket = 'Dua'
          // }
          // if (element.tempatlahir == 3) {
          //   this.item.antriLoket3 = element.jenis + '-' + this.setNumberStr(element.noantrian)
          //   namaloket = 'Tiga'
          // }
          // if (element.tempatlahir == 4) {
          //   this.item.antriLoket4 = element.jenis + '-' + this.setNumberStr(element.noantrian)
          //   namaloket = 'Empat'
          // }
          // if (element.tempatlahir == 5) {
          //   this.item.antriLoket5 = element.jenis + '-' + this.setNumberStr(element.noantrian)
          //   namaloket = 'Lima'
          // }
          // if (element.tempatlahir == 6) {
          //   this.item.antriLoket6 = element.jenis + '-' + this.setNumberStr(element.noantrian)
          //   namaloket = 'Enam'
          // }
          // if (element.tempatlahir == 7) {
          //   this.item.antriLoket7 = element.jenis + '-' + this.setNumberStr(element.noantrian)
          //   namaloket = 'Tujuh'
          // }
          // if (element.tempatlahir == 8) {
          //   this.item.antriLoket8 = element.jenis + '-' + this.setNumberStr(element.noantrian)
          //   namaloket = 'Delapan'
          // }
        }
        console.log(this.listLoket)
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
      utterance.lang  = 'id-ID';
      // utterance.text = document.querySelector("textarea").value;
      utterance.pitch = 1;
      utterance.rate = 0.8;
      utterance.volume = 1;
      // Speak the utterance
      synthesis.speak(utterance);
      this.audio.pause();
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
    var jam = (h + ":" + m + ":" + s + " WIB");
    // $("#timer").html(tgl + ' ' + jam);
    // setTimeout(function () {this.getdate() }, 1000);
    var el: HTMLElement = document.getElementById('timer');

    this.jamSekarang = jam
    this.tgl = tgl
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
    if (this.item.url != undefined && this.item.url != '') {
      this.pilihVideo = this.item.url
    } else {
      this.pilihVideo = this.item.channel.url
    }

    this.popUp = false
    localStorage.setItem('urlVideo', this.pilihVideo)
    var isss = ''
    if (this.isVoiceBrowser) {
      isss = 'true'
    } else {
      isss = 'false'
    }
    localStorage.setItem('isVoiceBrowser', isss)
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
