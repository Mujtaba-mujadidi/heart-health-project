import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { User } from "../../models/user.model";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private form: FormGroup;
  private patientDetails: any = {} as any
  private patientBMI: number = 0
  weightGroup = "" //Patients wight group based in their BMI value
  isDoctor = false


  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
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
  //To Calculate the BMI every time the patient opens the home tab
  ionViewWillEnter(){
    this.firebaseProvider.getPatientsRecentProfile(this.navParams.data, 1).then(data => {
      this.calculatePatientsBMI(data[Object.keys(data)[0]].weight)
    }).catch(error => console.log(error))
  }

  private retrievePatientData() {
    this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("patients", this.navParams.data).then((details) => {
      this.patientDetails = details
    })
  }

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

  buildForm() {
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

  submitForm() {
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

  analyzeData() {

  }

}
