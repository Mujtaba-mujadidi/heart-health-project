import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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


  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authenticationProvider: AuthenticationProvider,
    private firebaseProvider: FirebaseProvider

  ) {
    this.buildForm();
  }

   ionViewDidLoad(){
     this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("patients").then((details)=>{
       this.patientDetails = details
     })
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

  analyzeData(){

  }

}
