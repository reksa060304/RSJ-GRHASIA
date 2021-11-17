import {Component, OnInit} from '@angular/core';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-config',
    template: `
        <a style="cursor: pointer" id="layout-config-button" class="layout-config-button" (click)="onConfigButtonClick($event)">
            <i class="pi pi-cog"></i>
        </a>
        <div class="layout-config" [ngClass]="{'layout-config-active': appMain.configActive}" (click)="appMain.onConfigClick($event)">
            <h5>Menu Type</h5>
            <div class="p-field-radiobutton">
                <p-radioButton name="layoutMode" value="static" [(ngModel)]="app.layoutMode" inputId="mode1"></p-radioButton>
                <label for="mode1">Static</label>
            </div>
            <div class="p-field-radiobutton">
                <p-radioButton name="layoutMode" value="overlay" [(ngModel)]="app.layoutMode" inputId="mode2"></p-radioButton>
                <label for="mode2">Overlay</label>
            </div>

            <h5>Input Style</h5>
            <div class="p-field-radiobutton">
                <p-radioButton name="inputStyle" value="outlined" [(ngModel)]="app.inputStyle" inputId="inputStyle1"></p-radioButton>
                <label for="inputStyle1">Outlined</label>
            </div>
            <div class="p-field-radiobutton">
                <p-radioButton name="inputStyle" value="filled" [(ngModel)]="app.inputStyle" inputId="inputStyle2"></p-radioButton>
                <label for="inputStyle2">Filled</label>
            </div>

            <h5>Ripple Effect</h5>
			<p-inputSwitch [ngModel]="app.ripple" (onChange)="appMain.onRippleChange($event)"></p-inputSwitch>

            <h5>Themes</h5>
            <div class="layout-themes">
                <div *ngFor="let theme of componentThemes">
                    <a style="cursor: pointer" (click)="changeTheme(theme.name)" [ngStyle]="{'background-color': theme.color}">
                        <i *ngIf="app.theme === theme.name" class="pi pi-check"></i>
                    </a>
                </div>
            </div>
        </div>
    `
})
export class AppConfigComponent implements OnInit {

    componentThemes: any[];

    constructor(public appMain: AppMainComponent, public app: AppComponent) {}

    ngOnInit() {
        this.componentThemes = [
            {name: 'blue', color: '#6ec5ff'},
            {name: 'green', color: '#61d42d'},
            {name: 'orange', color: '#fbc948'},
            {name: 'purple', color: '#7B6EFF'},
            {name: 'cyan', color: '#12caaf'},
            {name: 'deeporange', color: '#FA8863'},
            {name: 'bluegrey', color: '#7A929E'},
            {name: 'indigo', color: '#5B6BBF'},
            {name: 'lime', color: '#DBE955'},
            {name: 'pink', color: '#F1719C'},
        ];
    }

    changeTheme(theme) {
        this.app.theme = theme;
        const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
        const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;

        const themeHref = 'assets/theme/theme-' + theme + '.css';
        const layoutHref = 'assets/layout/css/layout-' + theme + '.css';

        this.replaceLink(themeLink, themeHref);
        this.replaceLink(layoutLink, layoutHref);
    }

    isIE() {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    }

    replaceLink(linkElement, href) {
        if (this.isIE()) {
            linkElement.setAttribute('href', href);
        } else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);
            });
        }
    }

    onConfigButtonClick(event) {
        this.appMain.configActive = !this.appMain.configActive;
        this.appMain.configClick = true;
        event.preventDefault();
    }
}
