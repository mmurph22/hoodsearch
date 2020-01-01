import { RatingsPage } from './../pages/ratings/ratings';
import { VenuePage } from './../pages/venue/venue';
import { NewVolunteerPage } from './../pages/newvolunteer/newvolunteer';
import { NewCoordinatorPage } from './../pages/newcoordinator/newcoordinator';

import { DbConnectionService } from './../services/DbConnectionService';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'; 
import { ToastService } from '../services/toast-service';
import { LoadingService } from '../services/loading-service';
import { GlobalProvider } from '../providers/global/global';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProfilePage } from '../pages/profile/profile';
import { OpportunitiesPage } from '../pages/opportunities/opportunities';
import { ScenariosPage } from '../pages/scenarios/scenarios';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from './../pages/login/login';
import { BookingsPage } from './../pages/bookings/bookings';
import { RegisterPage } from './../pages/register/register';
import { SurveysPage } from '../pages/surveys/surveys';
import { ResultsPage } from '../pages/results/results';

import { VenueEventsPage } from '../pages/events/events';

@NgModule({
  declarations: [
    MyApp,
    ContactPage,
    RegisterPage,
    HomePage,

    AboutPage,
    ProfilePage,
    OpportunitiesPage,
    ScenariosPage,
    SignupPage,
    BookingsPage,
    LoginPage,
    NewVolunteerPage,
    NewCoordinatorPage,
    VenuePage,
    VenueEventsPage,
    RatingsPage,
    TabsPage,
    SurveysPage,
    ResultsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    RegisterPage,
    HomePage,
    
    AboutPage,
    ProfilePage,
    OpportunitiesPage,
    ScenariosPage,
    SignupPage,
    BookingsPage,
    LoginPage,
    NewVolunteerPage,
    NewCoordinatorPage,
    VenuePage,
    VenueEventsPage,
    RatingsPage,
    TabsPage,
    SurveysPage,
    ResultsPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    StatusBar,
    SplashScreen,
    HttpModule,
    ToastService, 
    LoadingService,
    DbConnectionService,
    GlobalProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},   
  ]
})
export class AppModule {}
