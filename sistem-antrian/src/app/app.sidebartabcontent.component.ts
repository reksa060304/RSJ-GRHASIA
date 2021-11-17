import {Component} from '@angular/core';

@Component({
    /* tslint:disable:component-selector */
    selector: 'app-sidebarTabContent',
    /* tslint:enable:component-selector */
    template: `
		<div class="layout-submenu-content">
			<div class="menu-scroll-content">
				<ng-content></ng-content>
			</div>
		</div>
    `
})
export class AppSideBarTabContentComponent {
}
