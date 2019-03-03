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
  private patientDetails: User = {} as any
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
    if (this.authenticationProvider.isDoctor) {
      this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("patients", this.navParams.data).then((details) => {
        this.patientDetails = details
      })
    } else {
      this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("patients").then((details) => {
        this.patientDetails = details
      })
    }
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
    const dateFormated = (today.getFullYear()) + "-" + (today.getMonth() + 1) + "-" + ((today.getDate() <= 9) ? ("0" + today.getDate()) : today.getDate());
    const userUid = this.firebaseProvider.getCurrentUserUid();
    this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("patientsHealth/" + userUid, this.form.value, dateFormated);
  }

  analyzeData() {

  }

}
