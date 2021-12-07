import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-denah',
  templateUrl: './denah.component.html',
  styleUrls: ['./denah.component.scss']
})
export class DenahComponent implements OnInit {
  contentHeader: any
  constructor() { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Informasi Denah',
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

}
