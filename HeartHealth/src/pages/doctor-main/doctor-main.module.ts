import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorMainPage } from './doctor-main';

@NgModule({
  declarations: [
    DoctorMainPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorMainPage),
  ],
})
export class DoctorMainPageModule {}
