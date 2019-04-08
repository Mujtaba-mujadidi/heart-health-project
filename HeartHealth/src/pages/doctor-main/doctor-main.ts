import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Observable } from "rxjs";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { TabsPage } from "../tabs/tabs";
import { PredictionProvider } from "../../providers/prediction/prediction";
import { LoginPage } from "../authentication/login/login";

/**
 * Doctor main page once successfully logged in.
 */

@IonicPage()
@Component({
  selector: 'page-doctor-main',
  templateUrl: 'doctor-main.html',
})
export class DoctorMainPage {

  doctorMainPageSegment: string = "patients"; //To active the patients tab by default

  listOfPatients: Observable<any[]> //List of patients registered with the doctor
  listOfPotentialPatients: Observable<any[]> = {} as any //List of potential patients registered with the doctor

  viewSortedPatientsBasedOnRisk = false //Used to hide and show different lists based on user selection
  isListSorted = false; //to avoid sorting a list multiple times
  sortedListOfPatients = [] //List of patients sorted in decreasing risk of developing heart disease.

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
   * @description: To retrieve list of patients and potential patients registered with this Doctor
   */
  private getListOfPatients() {
    this.firebaseProvider.getObservablesByMatch("potentialPatients", "doctorKey").subscribe(data => {
      this.listOfPotentialPatients = data
    })
    this.firebaseProvider.getObservablesByMatch("patients", "doctorKey").subscribe(data => {
      this.listOfPatients = data
      this.sortedListOfPatients = []
      this.isListSorted = false
      /**For each patient calculate their risk and add it as a property*/
      data.forEach((patient: any) => {
        this.predictionProvider.predict(patient.key).then((object: any) => {
          patient.risk = object.recentPrediction
          this.sortedListOfPatients.push(patient)
        }).catch(err => console.log("No health profile for this patient"));
      })
    })
  }

  /**
   * @description: To approve the registration of the potential patient
   * @param patient 
   */
  private approveRegistration(patient) {
    this.authenticationProvider.approvePatientRegistration(patient);
  }

  /**
   * @description: To reject registration of the potential patient
   * @param patient 
   */
  private rejectRegistration(patient) {
    this.authenticationProvider.rejectPatientRegistration(patient)
  }

  /**
   * @description: To sort list of patients in decreasing order of risk score
   */
  private sortListOfPatients() {
    if (!this.isListSorted) {
      this.sortedListOfPatients.sort((a, b) => a.risk > b.risk ? -1 : a.risk < b.risk ? 1 : 0)
      this.isListSorted = true //once list is sorted, set this to true to avoid resorting the list.
    }
  }

  /**
   * @description: To view patient profile with the matching key.
   * @param patient 
   */
  private viewPatient(patient) {
    this.navCtrl.push(TabsPage, patient.key)
  }

  /**
   *@description: To logout user from the app
   */
  private logout() {
    this.authenticationProvider.logout().then(() => {
      this.application.getRootNavs()[0].setRoot(LoginPage)
    });
  }

}
