import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

import { coreConfig } from 'app/app-config';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { fakeBackendProvider } from 'app/auth/helpers'; // used to create fake backend
import { JwtInterceptor, ErrorInterceptor } from 'app/auth/helpers';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { ContextMenuComponent } from 'app/main/extensions/context-menu/context-menu.component';
import { AnimatedCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/animated-custom-context-menu/animated-custom-context-menu.component';
import { BasicCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/basic-custom-context-menu/basic-custom-context-menu.component';
import { SubMenuCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/sub-menu-custom-context-menu/sub-menu-custom-context-menu.component';
import { CacheService } from './main/module/cache.service';
import { HttpClient } from './main/module/HttpClient';
import { ToastrsModule } from './main/extensions/toastr/toastr.module';
import { HttpService } from './main/module/httpService';
import { LoaderComp } from './main/components/loader/loader.component';
import { LoaderService } from './main/components/loader/loader.service';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
const appRoutes: Routes = [
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule)
  // },
  // {
  //   path: 'apps',
  //   loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  // {
  //   path: 'ui',
  //   loadChildren: () => import('./main/ui/ui.module').then(m => m.UIModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'components',
  //   loadChildren: () => import('./main/components/components.module').then(m => m.ComponentsModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'extensions',
  //   loadChildren: () => import('./main/extensions/extensions.module').then(m => m.ExtensionsModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'forms',
  //   loadChildren: () => import('./main/forms/forms.module').then(m => m.FormsModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'tables',
  //   loadChildren: () => import('./main/tables/tables.module').then(m => m.TablesModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'charts-and-maps',
  //   loadChildren: () => import('./main/charts-and-maps/charts-and-maps.module').then(m => m.ChartsAndMapsModule),
  //   canActivate: [AuthGuard]
  // },
  { path: 'touchscreen', loadChildren: () => import('./main/module/touchscreen/touchscreen.module').then(m => m.TouchscreenModule), },
  { path: 'choose-poli', loadChildren: () => import('./main/module/choose-poli/choose-poli.module').then(m => m.ChoosePoliModule), },
  { path: 'touchscreen/self-regis', loadChildren: () => import('./main/module/self-regis/self-regis.module').then(m => m.SelfRegisModule), },
  { path: 'touchscreen/self-regis/verif-pasien', loadChildren: () => import('./main/module/verif-pasien/verif-pasien.module').then(m => m.VerifPasienModule), },
  { path: 'touchscreen/self-regis/verif-pasien/poli', loadChildren: () => import('./main/module/pilih-poli/pilih-poli.module').then(m => m.PilihPoliModule), },
  { path: 'touchscreen/checkin', loadChildren: () => import('./main/module/checkin/checkin.module').then(m => m.CheckinModule), },
  { path: 'touchscreen/self-regis/verif-pasien-bpjs-old', loadChildren: () => import('./main/module/verif-pasien-bpjs/verif-pasien-bpjs.module').then(m => m.VerifPasienBpjsModule), },
  { path: 'touchscreen/self-regis/verif-pasien-bpjs', loadChildren: () => import('./main/module/verif-pasien-bpjs-old/verif-pasien-bpjs-old.module').then(m => m.VerifPasienBpjsOldModule), },
  
  { path: 'informasi-profil', loadChildren: () => import('./main/module/informasi-profil/informasi-profil.module').then(m => m.InformasiProfilModule), },
  { path: 'gallery', loadChildren: () => import('./main/module/gallery/gallery.module').then(m => m.GalleryModule), },
  { path: 'informasi-pelayanan', loadChildren: () => import('./main/module/informasi-pelayanan/informasi-pelayanan.module').then(m => m.InformasiPelayananModule), },
  { path: 'denah', loadChildren: () => import('./main/module/denah/denah.module').then(m => m.DenahModule), },
  { path: 'informasi-promosi', loadChildren: () => import('./main/module/informasi-promosi/informasi-promosi.module').then(m => m.InformasiPromosiModule), },
  { path: 'informasi-bantuan', loadChildren: () => import('./main/module/informasi-bantuan/informasi-bantuan.module').then(m => m.InformasiBantuanModule), },
  { path: 'informasi-kamar', loadChildren: () => import('./main/module/informasi-kamar/informasi-kamar.module').then(m => m.InformasiKamarModule), },
  { path: 'info-kritik', loadChildren: () => import('./main/module/info-kritik/info-kritik.module').then(m => m.InfoKritikModule), },
  { path: 'cek-kepesertaan-bpjs', loadChildren: () => import('./main/module/cek-kepesertaan-bpjs/cek-kepesertaan-bpjs.module').then(m => m.CekKepesertaanBpjsModule), },
 

  {
    path: '',
    redirectTo: 'touchscreen',
    pathMatch: 'full'
  },
  // {
  //   path: 'kiosk',
  //   redirectTo: 'touchscreen',
  // },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ContextMenuComponent,
    BasicCustomContextMenuComponent,
    AnimatedCustomContextMenuComponent,
    SubMenuCustomContextMenuComponent,
    // LoaderComp
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    NgbModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
    ContextMenuModule,
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    CardSnippetModule,
    LayoutModule,
    ContentHeaderModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: APP_BASE_HREF, useValue: '/' },
    CacheService, HttpService,
    // LoaderService,
    // HttpClient,

    // provider used to create fake backend, comment while using real api
    fakeBackendProvider
  ],
  entryComponents: [BasicCustomContextMenuComponent, AnimatedCustomContextMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
