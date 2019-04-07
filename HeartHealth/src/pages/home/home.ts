import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { User } from "../../models/user.model";
import { DoctorMainPage } from "../doctor-main/doctor-main";
import { LoginPage } from "../authentication/login/login";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private isPatientEditingDetails = false

  private patientHealthRecordForm: FormGroup;
  private patientDetailsForm: FormGroup;
  private patientDetails: any = {} as any //personal inpatientHealthRecordFormation of patient.
  private patientBMI: number = 0
  private weightGroup = "" //Patients wight group based on their BMI value
  private isDoctor = false


  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private application: App,
    private formBuilder: FormBuilder,
    private authenticationProvider: AuthenticationProvider,
    private firebaseProvider: FirebaseProvider,

  ) {
    this.buildPatientHealthRecordForm();
  }

  ionViewDidLoad() {
    this.isDoctor = this.authenticationProvider.isDoctor
    this.retrievePatientData()
  }

  /**
   * @description: To edit patients details
   */
  private editDetails() {
    this.isPatientEditingDetails = true;
  }


  /**
   * @description: To update patient details in firebase
   */
  private saveEdit() {
    this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("patients", this.patientDetailsForm.value).then(()=>{
      alert("Details updated successfully");
      this.isPatientEditingDetails = false
      this.patientDetails = this.patientDetailsForm.value
    }).catch(error => alert(error))
  }

  /**
   * @description: To cancel patient details edit.
   */
  private cancelEdit() {
    this.isPatientEditingDetails = false;
  }

  /**
   * Method is invoked every time the page is entered!
   * To Calculate the BMI of the patient.
   */
  ionViewWillEnter() {
    this.firebaseProvider.getPatientsProfile(this.navParams.data, 1).then(data => {
      this.calculatePatientsBMI(data[Object.keys(data)[0]].weight)
    }).catch(error => console.log(error))
  }

  /**
   * @description: To retrieve patient's personal inpatientHealthRecordFormation from the firebase.
   */
  private retrievePatientData() {
    this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("patients", this.navParams.data).then((details) => {
      this.patientDetails = details
      this.buildPatientDetailsForm()
    })
  }

  /**
   * @description: To calculate patients BMI score base on their height and weight.
   * @param weight 
   */
  private calculatePatientsBMI(weight) {
    const height = (this.patientDetails.height / 100)
    this.patientBMI = parseFloat((weight / (height * height)).toFixed(1))
    if (this.patientBMI <= 18.5) this.weightGroup = "Under Wight"
    else if (this.patientBMI <= 24.9) this.weightGroup = "Normal Wight"
    else if (this.patientBMI <= 29.9) this.weightGroup = "Pre-Obesity (Overweight)"
    else if (this.patientBMI <= 34.9) this.weightGroup = "Obesity Class 1"
    else if (this.patientBMI <= 39.9) this.weightGroup = "Obesity Class 2"
    else this.weightGroup = "Obesity Class 3"
  }

  /**
   * @description: To build the health record Form.
   */
  private buildPatientHealthRecordForm() {
    this.patientHealthRecordForm = this.formBuilder.group({
      systolicBloodPressure: ['', Validators.required],
      diastolicBloodPressure: ['', Validators.required],
      hearRate: ['72', Validators.required],
      weight: ['', Validators.required],
      glucose: ['', Validators.required],
      totalCholesterol: ['', Validators.required],
      hdlCholesterol: ['', Validators.required],
      fitnessLength: ['', Validators.required]
    })
  }

  /**
   * @description: To build the patient details editing Form.
   */
  private buildPatientDetailsForm() {
    this.patientDetailsForm = this.formBuilder.group({
      name: [this.patientDetails.name, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]+ [a-zA-Z ]+'), Validators.required])],
      address: [this.patientDetails.address, Validators.required],
      isDiabetic: [this.patientDetails.isDiabetic, Validators.required],
      didExperienceCardiovascularDisease: [this.patientDetails.didExperienceCardiovascularDisease, Validators.required],
      isSmoking: [this.patientDetails.isSmoking, Validators.required],
      haveHypertension: [this.patientDetails.haveHypertension, Validators.required],
      height: [this.patientDetails.height, Validators.required],
      isTreatedForHypertension: [this.patientDetails.isTreatedForHypertension, Validators.required],
      dateOfBirth: [this.patientDetails.dateOfBirth],
      doctorKey: [this.patientDetails.doctorKey],
      email: [this.patientDetails.email],
      sex: [this.patientDetails.sex]

    });
  }

  /**
   * @description: To submit the health patientHealthRecordForm. It sets the key of this object to be todays date in yyyy-mm-dd patientHealthRecordFormat. This achieves ordering of data in firebase.
   */
  private submitPatientHealthRecordForm() {
    const today = new Date()
    const month = (today.getMonth() + 1 < 10) ? ("0" + (today.getMonth() + 1)) : (today.getMonth() + 1);
    const day = ((today.getDate() <= 9) ? ("0" + today.getDate()) : today.getDate());
    const datepatientHealthRecordFormated = (today.getFullYear()) + "-" + month + "-" + day;
    const userUid = this.firebaseProvider.getCurrentUserUid();
    this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("patientsHealth/" + userUid, this.patientHealthRecordForm.value, datepatientHealthRecordFormated).then(() => {
      this.calculatePatientsBMI(this.patientHealthRecordForm.value.weight)
      this.patientHealthRecordForm.reset()
      alert("Your record submitted successfully")
    }).catch(error => alert(error));
  }


  /**
   * To return to Doctors main page from.
   */
  private goBackToDoctorMainPage() {
    this.application.getRootNavs()[0].setRoot(DoctorMainPage)
  }

  /**
   * To logout user from the app
   */
  private logout() {
    this.authenticationProvider.logout().then(() => {
      this.application.getRootNavs()[0].setRoot(LoginPage)
    });
  }


   /**
   *@description: To Convert measurement from Metric to Imperial units
   */
  private convertCmToFeet(){
    const height =  parseFloat((this.patientDetailsForm.value.height * 0.0328084).toFixed(2))
    this.patientDetailsForm.value.height =  (height > 7.00)? 7.00 : height 
  }


}
