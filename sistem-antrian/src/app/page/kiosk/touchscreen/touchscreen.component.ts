import { Component, OnInit, Inject, forwardRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from './../../../app.component';
import { FormBuilder } from '@angular/forms';
import { ApiService, } from 'src/app/service';
import { CacheService } from 'src/app/service/cache.service';
import { HttpClient } from '@angular/common/http';
import { VgApiService } from '@videogular/ngx-videogular/core';
@Component({
  selector: 'app-touchscreen',
  templateUrl: './touchscreen.component.html',
  styleUrls: ['./touchscreen.component.scss']
})
export class TouchscreenComponent implements OnInit, AfterViewInit {

  images: any[]
  // videoSource: any = 'assets/video/jasmed.mp4'
  videoSource: any = 'https://www.youtube.com/embed/Ci7I92shHiw'
  focus: boolean = true;
  model: any
  @ViewChild("scanBarcode") nameBarcode: ElementRef;
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  videoItems = [
    {
      name: 'Video one',
      src: 'http://static.videogular.com/assets/videos/videogular.mp4',
      type: 'video/mp4'
    },
    // {
    //   name: 'Video two',
    //   src: 'http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov',
    //   type: 'video/mp4'
    // },
    // {
    //   name: 'Video three',
    //   src: 'http://static.videogular.com/assets/videos/elephants-dream.mp4',
    //   type: 'video/mp4'
    // }
  ];

  activeIndex = 0;
  currentVideo = this.videoItems[this.activeIndex];
  data;
  api: any
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private el: ElementRef,
    private fb: FormBuilder,
    private cache: CacheService,
    private httpService: ApiService,
    private http: HttpClient) {

  }
  videoPlayerInit(api: VgApiService) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(
      this.playVideo.bind(this)
    );
  }

  playVideo() {
    this.api.play();
  }
  ngAfterViewInit(): void {
    console.log("afterinit");
    setTimeout(() => {
      this.nameBarcode.nativeElement.focus()
    }, 1000);
  }
  ngOnInit() {
    this.currentVideo = this.videoItems[0];
    // this.nameBarcode.nativeElement.focus();
  }

  goTo(name) {
    this.router.navigate(['touchscreen/' + name]);
  }
  onChangeNoreservasi(value: string) {
    if (value.length > 6) {
      this.cache.set('cacheAutoNoReservasi', value)
      this.router.navigate(['touchscreen/checkin']);
    }
  }
  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }
  print(jenis) {
    // debugger
    // this.router.navigate(['choose-poli'], { queryParams: { jenis: jenis } })
    let antrian = {
      "jenis": jenis
    }
    this.httpService.post('kiosk/save-antrian', antrian).subscribe(response => {
      this.http.get('http://127.0.0.1:3885/desk/routes?cetak-antrian=1&norec=' + response.noRec + '&jml=1').subscribe(a => { })
    })
  }
  nextVideo() {
    this.activeIndex++;

    if (this.activeIndex === this.videoItems.length) {
      this.activeIndex = 0;
    }

    this.currentVideo = this.videoItems[this.activeIndex];
  }

  initVdo() {
    this.data.play();
  }

  startPlaylistVdo(item, index: number) {
    this.activeIndex = index;
    this.currentVideo = item;
  }
}

