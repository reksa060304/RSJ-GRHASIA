import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { knowledgeBaseService } from 'app/main/pages/kb/knowledge-base/knowledge-base.service';
import * as snippet from 'app/main/components/carousel/carousel.snippetcode';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastService } from 'app/main/components/toasts/toasts.service';
import { ToastrService } from 'ngx-toastr';
// CarouselImages interface
export interface CarouselImages {
  one?: string;
  two?: string;
  three?: string;
  four?: string;
  five?: string;
  six?: string;
}
@Component({
  selector: 'app-touchscreen',
  templateUrl: './touchscreen.component.html',
  styleUrls: ['./touchscreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TouchscreenComponent implements OnInit {
  // public
  
  public contentHeader: object;
  public searchText: any;
  public data: any;
  model: any
  @ViewChild("scanBarcode") nameBarcode: ElementRef;
  now:any=moment(new Date()).format('DD MMM, YYYY')
  // private
  private _unsubscribeAll: Subject<any>;
  public carouselImages: CarouselImages = {
    one: 'assets/images/slider/01.jpg',
    two: 'assets/images/slider/02.jpg',
    three: 'assets/images/slider/03.jpg',
    four: 'assets/images/slider/04.jpg',
    five: 'assets/images/slider/05.jpg',
    six: 'assets/images/slider/06.jpg'
  };
    // snippet code variables
    public _snippetCodeBasicExample = snippet.snippetCodeBasicExample;
    public _snippetCodeOptionalCaptions = snippet.snippetCodeOptionalCaptions;
    public _snippetCodeIntervalOption = snippet.snippetCodeIntervalOption;
    public _snippetCodePauseOption = snippet.snippetCodePauseOption;
    public _snippetCodeWrapOption = snippet.snippetCodeWrapOption;
    public _snippetCodeKeyboardOption = snippet.snippetCodeKeyboardOption;
    public _snippetCodeNavigationArrow = snippet.snippetCodeNavigationArrow;
    public _snippetCodeNavigationIndicators = snippet.snippetCodeNavigationIndicators;
    public _snippetCodeCrossfade = snippet.snippetCodeCrossfade;
    public _snippetCodeActiveId = snippet.snippetCodeActiveId;
  /**
   * Constructor
   *
   * @param {knowledgeBaseService} _knowledgeBaseService
   */
  constructor(private _knowledgeBaseService: knowledgeBaseService,
    private _alertService: ToastrService,
    private router: Router,) {
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Changes
   */
  ngOnInit(): void {
    // this._knowledgeBaseService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.data = response;
    // });
    
  
    // content header
    this.contentHeader = {
      headerTitle: 'Kios-K',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: false,
            link: '/kiosk'
          },
        
        ]
      }
    };
  }
  print(jenis) {
    this.router.navigate(['choose-poli'], { queryParams: { jenis: jenis } })
  }
  goTo(name) {
    this.router.navigate(['touchscreen/' + name]);
  }
  onChangeNoreservasi(value: string) {
    if (value.length == 7) {
    
    }else{
 
    }
    alert(value);
  }
  clickBtn(url){
    this.router.navigate([url]);
    // this._alertService.info('','Under Construction', {
    //   toastClass: 'toast ngx-toastr',
    //   closeButton: true,
    //   positionClass: 'toast-bottom-center'
    // });
  }
}
