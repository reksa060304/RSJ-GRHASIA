import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from 'primeng/fullcalendar';

import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

import { MessageService } from 'primeng/api';
import { HeaderInterceptorService } from '../service/header-interceptor.service';
import { AuthService } from '../service/auth.service';
import { ApiService } from '../service/api.service';
import { LoaderService } from '../service/loader.service';
// import { TranslatorService } from '../service/translator.service';

import { SafeUrlPipe } from '../pipe/safe-url.pipe';
import { ThousandSeparatorPipe } from '../pipe/thousand-separator.pipe';
import { LoaderComponent } from '../page/loader/loader.component';
import { Config } from '../guard';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../service/component/alert/alert.service';
import { CacheService } from '../service/cache.service';
import { HelperService } from '../service/helperService';
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, Config.get().apiBackend + 'language?', '');
//   // return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }
@NgModule({
  declarations: [SafeUrlPipe, ThousandSeparatorPipe, LoaderComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    MessagesModule,
    SplitButtonModule,
    TableModule,
    ToastModule,
    ToggleButtonModule,
    SelectButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    PanelModule,
    ChartModule,
    TooltipModule,
    InputMaskModule,
    RadioButtonModule,
    SliderModule,
    MultiSelectModule,
    SelectButtonModule,
    FullCalendarModule,

    // additional
    AccordionModule, AutoCompleteModule, AvatarModule, AvatarGroupModule, BadgeModule, BreadcrumbModule, CardModule, CarouselModule,
    CascadeSelectModule, ChipModule, ChipsModule, CodeHighlighterModule, ConfirmPopupModule,
    ColorPickerModule, ContextMenuModule, DataViewModule, DividerModule, GalleriaModule, InplaceModule,
    InputNumberModule, InputSwitchModule, KnobModule, LightboxModule, ListboxModule, MegaMenuModule, MenuModule,
    MenubarModule, MessageModule, OrderListModule, OrganizationChartModule, OverlayPanelModule, PaginatorModule,
    PanelMenuModule, PasswordModule, PickListModule, ProgressBarModule, RatingModule, RippleModule, ScrollPanelModule,
    ScrollTopModule, SidebarModule, SkeletonModule, SlideMenuModule, SplitterModule, StepsModule, TabMenuModule, TagModule,
    TerminalModule, TieredMenuModule, TimelineModule, ToolbarModule, TreeModule, VirtualScrollerModule, TreeTableModule,
    // 
    // TranslateModule.forChild({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   }
    // })
  ],
  exports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    MessagesModule,
    SplitButtonModule,
    TableModule,
    ToastModule,
    ToggleButtonModule,
    FormsModule,
    ReactiveFormsModule,
    // TranslateModule,
    SafeUrlPipe,
    ThousandSeparatorPipe,
    LoaderComponent,
    TabViewModule,
    PanelModule,
    ChartModule,
    TooltipModule,
    InputMaskModule,
    RadioButtonModule,
    SliderModule,
    MultiSelectModule,
    SelectButtonModule,
    FullCalendarModule,
    // additional
    AccordionModule, AutoCompleteModule, AvatarModule, AvatarGroupModule, BadgeModule, BreadcrumbModule, CardModule, CarouselModule,
    CascadeSelectModule, ChipModule, ChipsModule, CodeHighlighterModule, ConfirmPopupModule,
    ColorPickerModule, ContextMenuModule, DataViewModule, DividerModule, GalleriaModule, InplaceModule,
    InputNumberModule, InputSwitchModule, KnobModule, LightboxModule, ListboxModule, MegaMenuModule, MenuModule,
    MenubarModule, MessageModule, OrderListModule, OrganizationChartModule, OverlayPanelModule, PaginatorModule,
    PanelMenuModule, PasswordModule, PickListModule, ProgressBarModule, RatingModule, RippleModule, ScrollPanelModule,
    ScrollTopModule, SidebarModule, SkeletonModule, SlideMenuModule, SplitterModule, StepsModule, TabMenuModule, TagModule,
    TerminalModule, TieredMenuModule, TimelineModule, ToolbarModule, TreeModule, VirtualScrollerModule, TreeTableModule,
    // 

  ]
})
export class primeNgModule {
  static forRoot(): ModuleWithProviders<NgModule> {
    return {
      ngModule: primeNgModule,
      providers: [
        AuthService, 
        // TranslatorService,
         MessageService, LoaderService, ApiService, AlertService, CacheService,
        HelperService,
        { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptorService, multi: true }
      ]
    };
  }
}
