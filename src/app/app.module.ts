import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AdddataPage  } from "../pages/adddata/adddata";
import { EditdataPage  } from "../pages/editdata/editdata";
import { ListPage } from "../pages/list/list";
import { CategoryPage } from "../pages/category/category";
import { AddcategoryPage } from "../pages/addcategory/addcategory";
import { SummaryPage } from "../pages/summary/summary";
import { DuePaymentPage } from "../pages/due-payment/due-payment";
import { AddDebtPage } from "../pages/add-debt/add-debt";
import { PopoverPage } from "../pages/popover/popover";
import { EditduePage } from "../pages/editdue/editdue";

import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { DatePicker } from '@ionic-native/date-picker';

import { TimelineComponent } from '../components/timeline/timeline';
import { TimelineTimeComponent } from '../components/timeline/timeline';
import { TimelineItemComponent } from '../components/timeline/timeline';
import { AccordionListComponent } from '../components/accordion-list/accordion-list';
import { ShrinkingSegmentHeader } from "../components/shrinking-segment-header/shrinking-segment-header";

import { DatabaseProvider } from '../providers/database/database';
import { MainPage } from "../pages/main/main";
import { IconsPage } from "../pages/icons/icons";
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ChartsModule } from 'ng2-charts';
import { DirectivesModule } from "../directives/directives.module";
import { PipesModule } from "../pipes/pipes.module";
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AdddataPage,
    EditdataPage,
    DuePaymentPage,
    AddDebtPage,
    ListPage,
    CategoryPage,
    AddcategoryPage,
    PopoverPage,
    TimelineComponent,
    TimelineItemComponent,
    TimelineTimeComponent,
    AccordionListComponent,
    ShrinkingSegmentHeader,
    EditduePage,
    SummaryPage,
    MainPage,
    IconsPage
  ],
  imports: [
    BrowserModule,
    DirectivesModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp,{scrollPadding: false, scrollAssist: true, autoFocusAssist: false}),
    IonicStorageModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    ChartsModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AdddataPage,
    EditdataPage,
    ListPage,
    DuePaymentPage,
    AddDebtPage,
    CategoryPage,
    AddcategoryPage,
    MainPage,
    PopoverPage,
    SummaryPage,
    IconsPage,
    EditduePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    Toast,
    DatePicker,
    LocalNotifications,

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
