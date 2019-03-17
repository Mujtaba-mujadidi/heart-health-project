import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Observable } from "rxjs";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { TabsPage } from "../tabs/tabs";
import { PredictionProvider } from "../../providers/prediction/prediction";
import { LoginPage } from "../authentication/login/login";

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
    private application: App,
    private firebaseProvider: FirebaseProvider,
    private predictionProvider: PredictionProvider,
    private authenticationProvider: AuthenticationProvider

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorMainPage');
    this.getListOfPatients()
  }

  /**
   * To retrieve list of patients and potential patients registered with this Doctor
   */
  private getListOfPatients() {
    this.firebaseProvider.getObservablesByMatch("potentialPatients", "doctorKey").subscribe(data => {
      this.listOfPotentialPatients = data
    })
    this.firebaseProvider.getObservablesByMatch("patients", "doctorKey").subscribe(data => {
      this.listOfPatients = data
      this.sortedListOfPatients = []
      this.isListSorted = false
      /**FOr each patient calculate their risk and add it as a property */
      data.forEach((patient: any) => {
        this.predictionProvider.predict(patient.key).then((object: any) => {
          patient.risk = object.recentPrediction
          this.sortedListOfPatients.push(patient)
        }).catch(err => console.log("No health profile for this patient"));
      })
    })
  }

  /**
   * To approve the registration of the potential patient
   * @param patient 
   */
  private approveRegistration(patient) {
    this.authenticationProvider.approvePatientRegistration(patient);
  }

  /**
   * To reject registration of the potential patient
   * @param patient 
   */
  private rejectRegistration(patient) {
    this.authenticationProvider.rejectPatientRegistration(patient)
  }

  /**
   * To sort list of patients in decreasing order of risk score
   */
  private sortListOfPatients() {
    if (!this.isListSorted) {
      this.sortedListOfPatients.sort((a, b) => a.risk > b.risk ? -1 : a.risk < b.risk ? 1 : 0)
      this.isListSorted = true
    }
  }

  private viewPatient(patient) {
    this.navCtrl.push(TabsPage, patient.key)
  }

  /**
   * To logout user from the app
   */
  private logout() {
    this.authenticationProvider.logout().then(() => {
      this.application.getRootNavs()[0].setRoot(LoginPage)
    });
  }

}
