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

  private form: FormGroup;
  private patientDetails: any = {} as any //personal information of patient.
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
    this.buildForm();
  }

  ionViewDidLoad() {
    this.isDoctor = this.authenticationProvider.isDoctor
    this.retrievePatientData()
  }
  /**
   * Method is invoked every time the page is entered!
   * To Calculate the BMI of the patient.
   */
  ionViewWillEnter(){
    this.firebaseProvider.getPatientsProfile(this.navParams.data, 1).then(data => {
      this.calculatePatientsBMI(data[Object.keys(data)[0]].weight)
    }).catch(error => console.log(error))
  } 

  /**
   * @description: To retrieve patient's personal information from the firebase.
   */
  private retrievePatientData() {
    this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("patients", this.navParams.data).then((details) => {
      this.patientDetails = details
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
   * @description: To build the health form.
   */
  private buildForm() {
    this.form = this.formBuilder.group({
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
   * @description: To submit the health form. It sets the key of this object to be todays date in yyyy-mm-dd format. This achieves ordering of data in firebase.
   */
  private submitForm() {
    const today = new Date()
    const month = (today.getMonth() + 1 < 10)? ("0" + (today.getMonth()+1)) : (today.getMonth()+1);
    const day = ((today.getDate() <= 9) ? ("0" + today.getDate()) : today.getDate());
    const dateFormated = (today.getFullYear()) + "-" + month + "-" + day;
    const userUid = this.firebaseProvider.getCurrentUserUid();
    this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("patientsHealth/" + userUid, this.form.value, dateFormated).then(() => {
      this.calculatePatientsBMI(this.form.value.weight)
      this.form.reset()
    });
  }


  /**
   * To return to Doctors main page from.
   */
  private goBackToDoctorMainPage(){
    this.application.getRootNavs()[0].setRoot(DoctorMainPage)
  }

  /**
   * To logout user from the app
   */
  private logout(){
    this.authenticationProvider.logout().then(()=>{
      this.application.getRootNavs()[0].setRoot(LoginPage)
    });
  }

}
