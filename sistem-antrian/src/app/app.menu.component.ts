import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { ApiService, AuthService } from './service';

@Component({
    selector: 'app-menu',
    // template: `
    // 	<ul class="navigation-menu">
    // 		<li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
    // 	</ul>
    // `
    template: `
		<ul class="navigation-menu">
            <div class="clearfix layout-menu-cari" style="text-align: center;  border-bottom: 1px solid #757575;">
                <p-autoComplete [(ngModel)]="app.itemMenu" [suggestions]="app.filteredMenu" 
                (completeMethod)="app.filterMenu($event)" field="label" (onSelect)="app.onSelectSearchMenu($event)" 
                [size]="29"
                placeholder="Search" [minLength]="2"  [style]="{'margin-bottom':'4px','border-radius':'5px'}"></p-autoComplete>
            </div>
            <li app-menuitem *ngFor="let item2 of dashboard; let i = index;" [item]="item2" [index]="i" [root]="true"></li>
			<li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
		</ul>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];
    // add
    dataLoginUser: any;
    menuItem: any[]
    hiddenMenu: any[]
    flatMenu: any[]
    dashboard: any[]
    menulama: any[]
    constructor(public app: AppMainComponent, private apiService: ApiService, public authService: AuthService) { }

    ngOnInit() {
        if (localStorage.getItem('storageKiosk')) {
            this.dataLoginUser = JSON.parse(localStorage.getItem('storageKiosk'))
        } else if (sessionStorage.getItem('storageKiosk')) {
            this.dataLoginUser = JSON.parse(sessionStorage.getItem('storageKiosk'))
        }
        // if (localStorage.getItem('menu')) {
        //     this.model = JSON.parse(localStorage.getItem('menu'))
        //     this.flatMenu = JSON.parse(localStorage.getItem('hiddenMenu'))
        //     let hidden = []
        //     this.flatMenu.forEach((data) => {
        //         if (data.isMenu == '0') {
        //             let url = data.routerLink[0]
        //             let dataTemp = {
        //                 label: '',
        //                 icon: data.icon,
        //                 routerLink: [url.replace(/\./g, '')]
        //             }
        //             hidden.push(dataTemp)
        //         }
        //     })
        //     localStorage.setItem('menu', JSON.stringify(this.model))
        //     this.authService.setListRoute(this.model.concat(hidden))
        // } else {

        this.apiService.get('modul/get-menu?idUser=' + this.dataLoginUser.id +
            '&Profile=' + this.dataLoginUser.kdProfile).subscribe((res) => {
                this.model = res;//this.sort(this.rekontruksiArray(res))
                this.flatMenu = (this.flat(res))
                let hidden = []
                hidden = this.model

                localStorage.setItem('menu', JSON.stringify(this.model))
                localStorage.setItem('storageKiosk', JSON.stringify(this.dataLoginUser))
                localStorage.setItem('hiddenMenu', JSON.stringify(this.flatMenu))
                this.authService.setListRoute(this.model.concat(hidden))
            })
        // }
        this.dashboard = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [''] },
        ]
        this.menulama = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
            {
                label: 'UI Kit', icon: 'pi pi-fw pi-star', routerLink: ['/uikit'], badge: 10,
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                    { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                    { label: 'Button', icon: 'pi pi-fw pi-mobile', routerLink: ['/uikit/button'], class: 'rotated-icon' },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle-off', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'Utilities', icon: 'pi pi-fw pi-compass', routerLink: ['utilities'], badge: 8, badgeStyleClass: 'orange-badge',
                items: [
                    { label: 'Display', icon: 'pi pi-fw pi-desktop', routerLink: ['utilities/display'] },
                    { label: 'Elevation', icon: 'pi pi-fw pi-external-link', routerLink: ['utilities/elevation'] },
                    { label: 'FlexBox', icon: 'pi pi-fw pi-directions', routerLink: ['utilities/flexbox'] },
                    { label: 'Icons', icon: 'pi pi-fw pi-search', routerLink: ['utilities/icons'] },
                    { label: 'Text', icon: 'pi pi-fw pi-pencil', routerLink: ['utilities/text'] },
                    { label: 'Widgets', icon: 'pi pi-fw pi-star-o', routerLink: ['utilities/widgets'] },
                    { label: 'Grid System', icon: 'pi pi-fw pi-th-large', routerLink: ['utilities/grid'] },
                    { label: 'Spacing', icon: 'pi pi-fw pi-arrow-right', routerLink: ['utilities/spacing'] },
                    { label: 'Typography', icon: 'pi pi-fw pi-align-center', routerLink: ['utilities/typography'] }
                ]
            },
            {
                label: 'Pages', icon: 'pi pi-fw pi-briefcase', routerLink: ['/pages'],
                items: [
                    { label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] },
                    { label: 'Calendar', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/calendar'] },
                    { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/timeline'] },
                    { label: 'Landing', icon: 'pi pi-fw pi-globe', url: 'assets/pages/landing.html', target: '_blank' },
                    { label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/login'] },
                    { label: 'Invoice', icon: 'pi pi-fw pi-dollar', routerLink: ['/pages/invoice'] },
                    { label: 'Help', icon: 'pi pi-fw pi-question-circle', routerLink: ['/pages/help'] },
                    { label: 'Error', icon: 'pi pi-fw pi-times-circle', routerLink: ['/error'] },
                    { label: 'Not Found', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/notfound'] },
                    { label: 'Access Denied', icon: 'pi pi-fw pi-lock', routerLink: ['/access'] },
                    { label: 'Empty', icon: 'pi pi-fw pi-circle-off', routerLink: ['/pages/empty'] }
                ]
            },
            {
                label: 'Hierarchy', icon: 'pi pi-fw pi-align-left',
                items: [
                    {
                        label: 'Submenu 1', icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'pi pi-fw pi-align-left',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-align-left' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-align-left' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-align-left' },
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'pi pi-fw pi-align-left',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-align-left' }
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-fw pi-align-left',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-align-left' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-align-left' },
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-fw pi-align-left',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-align-left' },
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Buy Now', icon: 'pi pi-fw pi-shopping-cart', url: ['https://www.primefaces.org/store']
            },
            {
                label: 'Documentation', icon: 'pi pi-fw pi-info-circle', routerLink: ['/documentation']
            }
        ];
    }
    rekontruksiArray(array: any[]) {
        let dataArray = []
        array.forEach((data) => {
            if (data.items) {
                let dataTemp = {
                    label: data.label,
                    icon: data.icon,
                    noUrut: data.NoUrut,
                    items: data.items
                }
                if (data.parent_id == "0") {
                    dataArray = this.rekontruksiArray(dataTemp.items)
                } else if (data.isShowHide == "0") {
                    dataArray = this.rekontruksiArray(dataTemp.items)
                } else {
                    dataArray.push(dataTemp)
                    dataTemp.items = this.rekontruksiArray(dataTemp.items)
                }
            } else if (data.routerLink) {
                let url = data.routerLink[0]
                let dataTemp = {
                    label: data.label,
                    icon: data.icon,
                    noUrut: data.NoUrut,
                    routerLink: [url.replace(/\./g, '')]
                }
                if (data.isMenu == '1') {
                    dataArray.push(dataTemp)
                }
            }
        })
        return dataArray
    }
    flat(array) {
        var result = [];
        array.forEach((data) => {
            result.push(data);
            if (Array.isArray(data.items)) {
                result = result.concat(this.flat(data.items));
            }
        });
        return result;
    }

    sort(arr) {
        let arraySorted
        let arrayChildeSorted
        arraySorted = arr.sort((a, b) => (parseInt(a.noUrut) == parseInt(b.noUrut)) ? (a.label > b.label) ? 1 : -1 : (parseInt(a.noUrut) > parseInt(b.noUrut)) ? 1 : -1)
        arraySorted.forEach(data => {
            if (data.items) {
                arrayChildeSorted = this.sort(data.items)
                data.items = arrayChildeSorted
            }
        });
        return arraySorted
    }
    getNestedChildren(arr, parent) {
        var out = []
        for (var i in arr) {
            if (arr[i].parent_id == parent) {
                var children = this.getNestedChildren(arr, arr[i].id)

                if (children.length) {
                    arr[i].children = children
                }
                out.push(arr[i])
            }
        }
        return out
    }
}
