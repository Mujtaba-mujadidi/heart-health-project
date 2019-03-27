import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationProvider } from "../../../providers/authentication/authentication";
import { User } from "../../../models/user.model";
import { FirebaseProvider } from "../../../providers/firebase/firebase";
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  private emailRegex = /(.)+@(\w)+\.(.)/; //Validates email format
  public registrationForm: FormGroup; //Registration form used for Doctors registration
  private registrationFormPatient: FormGroup; //Registration form used for Patients registration.
  private userType = ""; //Type of user registering to the app.
  //private potentialPatientDoctorKey = {} as any //
  listOfDoctors: Observable<any[]>; //List of doctors that the new patient can register with.

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authenticationProvider: AuthenticationProvider,
    private firebaseProvider: FirebaseProvider
  ) {
    this.buildRegistrationForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    this.listOfDoctors = this.firebaseProvider.getObservables("doctors")
  }

  /**
   * @description: To initialise registration forms.
   */
  private buildRegistrationForm() {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]+ [a-zA-Z ]+'), Validators.required])],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern(this.emailRegex), Validators.required])],
      password: ['', Validators.required]
    });

    this.registrationFormPatient = this.formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]+ [a-zA-Z ]+'), Validators.required])],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      doctorKey: ['', Validators.required],
      isDiabetic: [Validators.required],
      didExperienceCardiovascularDisease: [Validators.required],
      isSmoking: [Validators.required],
      haveHypertension: [Validators.required],
      height: [0.00, Validators.required],
      isTreatedForHypertension: [false, Validators.required],
      email: ['', Validators.compose([Validators.pattern(this.emailRegex), Validators.required])],
      password: ['', Validators.required]
    });
  }

  /**
   * @description: to sign up
   */
  private signUp() {
    const userDetails =  (this.userType == "patient")? this.registrationFormPatient.value : this.registrationForm.value

    this.authenticationProvider.signUp(userDetails.email, userDetails.password).then(() => {
      this.registerNewUser(userDetails)
    }).catch((error) => console.log(error))
  }

  /**
   * To store user detains in firebase database
   * @param userDetails 
   */
  private registerNewUser(userDetails) {
    if (this.userType == "patient") {
      this.authenticationProvider.registerUser(this.userType, userDetails).then(() => {
        alert("Please await for your registration to be approved by your doctor")
        this.registrationFormPatient.reset()
      }).catch((error) => console.log(error))
    } else {
      this.authenticationProvider.registerUser(this.userType, userDetails).then(() => {
        alert("Registered successfully!")
        this.registrationForm.reset()
        this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("userType", { type: "doctor" })
      }).catch((error) => console.log(error))
    }
  }

  /**
   *@description: To Convert measurement from Metric to Imperial units
   */
  private convertCmToFeet(){
    const height =  parseFloat((this.registrationFormPatient.value.height * 0.0328084).toFixed(2))
    this.registrationFormPatient.value.height =  (height > 7.00)? 7.00 : height 
  }

}
