import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { StatisticsPage } from "../statistics/statistics";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = StatisticsPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
