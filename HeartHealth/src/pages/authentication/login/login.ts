import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { SignUpPage } from "../sign-up/sign-up";
import { AuthenticationProvider } from "../../../providers/authentication/authentication";
import { TabsPage } from "../../tabs/tabs";
import { DoctorMainPage } from "../../doctor-main/doctor-main";

/**
 * Login page contains login functionalities.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private email = "";
  private password = ""

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertController: AlertController,
    private toastController: ToastController,
    private authenticationProvider: AuthenticationProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  /**
   * @description: to navigate to registration page
   */
  private goToSignUp() {
    this.navCtrl.push(SignUpPage)
  }

  /**
   * @description: To sign in to the app
   */
  private signIn() {
    this.authenticationProvider.signIn(this.email, this.password).then(object => {
      if (object.type == "doctor") {
        this.navCtrl.setRoot(DoctorMainPage)
      } else {
        this.navCtrl.setRoot(TabsPage)
      }
    }).catch(error => {
      alert(error)
      console.log(error)
    });
  }


  /**
   * @description: To request a password rest link
   */
  private resetPassword() {

    let successfulAlert = this.alertController.create({ buttons: ['OK'] });
    let failureAlert = this.alertController.create({ buttons: ['Try Again'] });

    this.alertController.create({
      title: "Password reset",
      message: "Please provide your email address account in order to reset your password.",
      inputs: [
        {
          name: 'emailAddress',
          placeholder: 'Email Address'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Continue',
          handler: data => {
            if (data.emailAddress.trim() != "") {
              this.email = data.emailAddress;
              this.authenticationProvider.resetPassword(this.email).then(() => {
                successfulAlert.setTitle("Success");
                successfulAlert.setMessage("A link has been sent to your email to reset your password.");
                successfulAlert.present();
              }).catch((error) => {
                failureAlert.setTitle("Invalid email");
                failureAlert.setMessage("The email you have provided is not recognized!");
                failureAlert.present();
              });
            } else {
              this.toastController.create({
                message: 'Please enter your email address in order to proceed',
                duration: 3500,
                position: 'top',
              }).present();
            }
          }
        }
      ]
    }).present();
  }

}
