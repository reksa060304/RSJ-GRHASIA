import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import localId from '@angular/common/locales/id'
// import { TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppCodeModule } from './app.code.component';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AppConfigComponent } from './app.config.component';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { AppSideBarComponent } from './app.sidebar.component';
import { AppSideBarTabContentComponent } from './app.sidebartabcontent.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { primeNgModule } from './shared/shared.module';

import { LoginComponent } from './page/login/login.component';
// import { DashboardComponent } from './page/dashboard/dashboard.component';
import { NotFoundComponent } from './page/not-found/not-found.component';
import { AccessDeniedComponent } from './page/access-denied/access-denied.component';
import { Config } from './guard';
import { NotificationService } from './service/notification.service';
import { SocketService } from './service/socket.service';

// export function HttpLoaderFactory(http: HttpClient) {
//     return new TranslateHttpLoader(http, Config.get().apiBackend + 'language?', '');
//     // return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }
// export class MyMissingTranslationHandler implements MissingTranslationHandler {
//     handle(_params: MissingTranslationHandlerParams) {
//         return 'Undefined';
//     }
// }

registerLocaleData(localId, 'id');


// Application services
import { MenuService } from './app.menu.service';
// import { DemoComponent } from './shared/demo.module';
// import { demoServices } from './shared/demo.module';
import { PasswordModule } from 'primeng/password';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AlertComp } from './service/component/alert/alert.component';
import { DPlayerModule, DPlayerService } from 'angular-dplayer';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        PasswordModule,
        ScrollPanelModule,
        OverlayPanelModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppCodeModule,
        
        // TranslateModule.forRoot({
        //     loader: {
        //         provide: TranslateLoader,
        //         useFactory: HttpLoaderFactory,
        //         deps: [HttpClient]
        //     },
        //     missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
        //     useDefaultLang: false
        // }),
        primeNgModule.forRoot(),
        DPlayerModule.forRoot({ // Global config
            autoplay: true      // All player can autoplay by default
        })
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppSideBarComponent,
        AppSideBarTabContentComponent,
        // DemoComponent,
        LoginComponent,
        // DashboardComponent,
        NotFoundComponent,
        AccessDeniedComponent,
        AlertComp
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        // demoServices,
        MenuService,
        DPlayerService,
        NotificationService,
        SocketService,
        { provide: LOCALE_ID, useValue: 'id' }
    ],

    bootstrap: [AppComponent]
})
export class AppModule { }
