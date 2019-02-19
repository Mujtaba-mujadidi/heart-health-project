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

  private emailRegex = /(.)+@(\w)+\.(.)/;
  public registrationForm: FormGroup;
  private userType = "";
  private potentialPatientDoctorKey = {} as any
  listOfDoctors: Observable<any[]>;
  
  //[{ name: "a" }, { name: "b" }, { name: "c" }]


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
    
    
    
    // subscribe(data => {
    //   this.listOfDoctors = data
    // });
  }

  private buildRegistrationForm() {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]+ [a-zA-Z ]+'), Validators.required])],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern(this.emailRegex), Validators.required])],
      password: ['', Validators.compose([Validators.pattern("[0-9]{6,6}"), Validators.required])],
    });
  }

  signUp() {
    const userDetails = this.registrationForm.value
    this.authenticationProvider.signUp(userDetails.email, userDetails.password).then(() => {
      this.registerNewUser(userDetails)
    }).catch((error) => console.log(error))
  }


  registerNewUser(userDetails){
    console.log(this.userType)
    if (this.userType == "patient"){
        this.authenticationProvider.registerUser(this.userType, userDetails, this.potentialPatientDoctorKey).then(()=>{
          alert("Please await for your registration to be approved by your doctor")
        }).catch((error)=>console.log(error))
      }else{
         this.authenticationProvider.registerUser(this.userType, userDetails).then(()=>{
           alert("Registered successfully!")
           this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("userType", {type: "doctor"})
         }).catch((error)=>console.log(error))
      }
  }

}
