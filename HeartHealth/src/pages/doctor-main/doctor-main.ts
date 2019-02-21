import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from "rxjs";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { TabsPage } from "../tabs/tabs";

/**
 * Generated class for the DoctorMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-doctor-main',
  templateUrl: 'doctor-main.html',
})
export class DoctorMainPage {

  doctorMainPageSegment: string = "patients";

  listOfPatients: Observable<any[]>
  listOfPotentialPatients: Observable<any[]>  = {} as any

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private firebaseProvider: FirebaseProvider,
    private authenticationProvider: AuthenticationProvider
    
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorMainPage');
    this.getListOfPatients()
  }

  getListOfPatients(){
    this.firebaseProvider.getObservablesByMatch("potentialPatients", "doctorKey").subscribe(data => {
      this.listOfPotentialPatients = data
    })

    this.firebaseProvider.getObservablesByMatch("patients", "doctorKey").subscribe(data => {
      this.listOfPatients = data
    })

  }

  approveRegistration(patient){
    this.authenticationProvider.approvePatientRegistration(patient);
  }

  rejectRegistration(patient){
    this.authenticationProvider.rejectPatientRegistration(patient)
  }

  viewPatient(patient){
    this.navCtrl.push(TabsPage, patient.key)
  }

}
