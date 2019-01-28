import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from "../pages/authentication/login/login";
import { SignUpPage } from "../pages/authentication/sign-up/sign-up";


import { FIREBASE_CONFIG } from "./firebase.credentials";
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { AuthenticationProvider } from "../providers/authentication/authentication";
import { DoctorMainPage } from "../pages/doctor-main/doctor-main";
import { StatisticsPage } from "../pages/statistics/statistics";
import { StatisticsProvider } from '../providers/statistics/statistics';
import { PredictionPage } from "../pages/prediction/prediction";
import { PredictionProvider } from "../providers/prediction/prediction";



import { HttpClientModule} from '@angular/common/http';




@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignUpPage,
    DoctorMainPage,
    PredictionPage,
    HomePage,
    StatisticsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    HttpClientModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignUpPage,
    DoctorMainPage,
    PredictionPage,
    HomePage,
    StatisticsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Firebase,
    AngularFireAuth,
    FirebaseProvider,
    AuthenticationProvider,
    StatisticsProvider,
    PredictionProvider
  ]
})
export class AppModule {}
