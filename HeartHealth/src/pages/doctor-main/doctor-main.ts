import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from "rxjs";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { TabsPage } from "../tabs/tabs";
import { PredictionProvider } from "../../providers/prediction/prediction";

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
  listOfPotentialPatients: Observable<any[]> = {} as any

  viewSortedPatientsBasedOnRisk = false //Used to hide and show different lists based on user selection
  isListSorted = false;

  sortedListOfPatients = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private firebaseProvider: FirebaseProvider,
    private predictionProvider: PredictionProvider,
    private authenticationProvider: AuthenticationProvider

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorMainPage');
    this.getListOfPatients()
  }

  getListOfPatients() {
    this.firebaseProvider.getObservablesByMatch("potentialPatients", "doctorKey").subscribe(data => {
      this.listOfPotentialPatients = data
    })
    this.firebaseProvider.getObservablesByMatch("patients", "doctorKey").subscribe(data => {
      this.listOfPatients = data
      this.sortedListOfPatients = []
      this.isListSorted = false
      data.forEach((patient: any) => {
        this.predictionProvider.predict(patient.key).then((object: any) => {
          patient.risk = object.recentPrediction
          this.sortedListOfPatients.push(patient)
        }).catch(err => console.log("No health profile for this patient"));
      })
    })
  }

  approveRegistration(patient) {
    this.authenticationProvider.approvePatientRegistration(patient);
  }

  rejectRegistration(patient) {
    this.authenticationProvider.rejectPatientRegistration(patient)
  }

  sortListOfPatients() {
    if (!this.isListSorted) {
      this.sortedListOfPatients.sort((a, b) => a.risk > b.risk ? -1 : a.risk < b.risk ? 1 : 0)
      this.isListSorted = true
    }
  }

  viewPatient(patient) {
    this.navCtrl.push(TabsPage, patient.key)
  }

}
