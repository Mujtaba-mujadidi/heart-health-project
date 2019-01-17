import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { AuthenticationProvider } from "../../providers/authentication/authentication";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public form: FormGroup;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authenticationProvider: AuthenticationProvider,
    private firebaseProvider: FirebaseProvider

  ) {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      systolicBloodPressure: ['', Validators.required],
      diastolicBloodPressure: ['', Validators.required],
      hearRate: ['72', Validators.required],
      weight: ['', Validators.required],
      glucose: ['', Validators.required],
      fitnessLength: ['', Validators.required]

    })
  }

  submitForm() {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date().toLocaleDateString("en-gb", options)
    const userUid = this.firebaseProvider.getCurrentUserUid();
    this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("patientsHealth/"+userUid, this.form.value, date);
  }

}
