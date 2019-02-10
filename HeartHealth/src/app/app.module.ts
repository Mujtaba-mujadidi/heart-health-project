import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatisticsProvider } from '../providers/statistics/statistics';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { PredictionProvider } from '../providers/prediction/prediction';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { DoctorMainPage } from "../pages/doctor-main/doctor-main";
import { PredictionPage } from "../pages/prediction/prediction";
import { StatisticsPage } from "../pages/statistics/statistics";
import { ProgressBarComponent } from "../components/progress-bar/progress-bar";

import { FIREBASE_CONFIG } from "./firebase.credentials";
import { AngularFireModule } from '@angular/fire';;
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/authentication/login/login";
import { SignUpPage } from "../pages/authentication/sign-up/sign-up";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuth } from '@angular/fire/auth';




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    SignUpPage,
    DoctorMainPage,
    StatisticsPage,
    PredictionPage,
    ProgressBarComponent

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    SignUpPage,
    DoctorMainPage,
    StatisticsPage,
    PredictionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    StatisticsProvider,
    FirebaseProvider,
    PredictionProvider,
    AuthenticationProvider,
    AngularFireAuth
  ]
})
export class AppModule { }
