import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { StatisticsPage } from "../statistics/statistics";
import { PredictionPage } from "../prediction/prediction";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { NavParams } from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  patientId = ""

  tab1Root = HomePage;
  tab2Root = StatisticsPage;
  tab3Root = PredictionPage;

  constructor( navParams: NavParams ,private authenticationProvider: AuthenticationProvider ) {
    if(this.authenticationProvider.isDoctor) this.patientId = navParams.data
  }
}
