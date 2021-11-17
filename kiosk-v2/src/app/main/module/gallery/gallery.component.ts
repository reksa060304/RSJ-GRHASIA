import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GalleryComponent implements OnInit {

  // public

  public contentHeader: object;
  public searchText: any;
  public data: any;
  model: any

  // private
  private _unsubscribeAll: Subject<any>;
  public carouselImages: CarouselImages = {
    one: 'assets/images/gallery/01.jpg',
    two: 'assets/images/gallery/02.jpg',
    three: 'assets/images/gallery/03.jpg',
    four: 'assets/images/gallery/04.jpg',
    five: 'assets/images/gallery/05.jpg',
  };
  public carouselImages2: CarouselImages = {
    one: 'assets/images/gallery/06.jpg',
    two: 'assets/images/gallery/07.jpg',
    three: 'assets/images/gallery/08.jpg',
    four: 'assets/images/gallery/09.jpg',
    five: 'assets/images/gallery/10.jpg',
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

  constructor(
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
      headerTitle: 'Gallery',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: false,
            link: '/touchscreen'
          },

        ]
      }
    };
  }

}
