import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-actions',
  templateUrl: './card-actions.component.html'
})
export class CardActionsComponent implements OnInit {
  // Public
  public contentHeader: object;

  constructor() {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    // content header
    this.contentHeader = {
      headerTitle: 'Card Actions',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Cards',
            isLink: true,
            link: '/'
          },
          {
            name: 'Card Actions ',
            isLink: false
          }
        ]
      }
    };
  }
}
