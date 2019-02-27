import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignUpPage } from "../sign-up/sign-up";
import { AuthenticationProvider } from "../../../providers/authentication/authentication";
import { TabsPage } from "../../tabs/tabs";
import { DoctorMainPage } from "../../doctor-main/doctor-main";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private email = "muj@g.com";
  private password = "123456"

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authenticationProvider: AuthenticationProvider
    
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToSignUp(){
    this.navCtrl.push(SignUpPage)
  }

  signIn(){
    this.authenticationProvider.signIn(this.email, this.password).then(object => {
      if(object.type == "doctor"){
        this.navCtrl.setRoot(DoctorMainPage)
      }else{
        this.navCtrl.setRoot(TabsPage)
      }
    }).catch(error => {
      console.log(error)
    });
  }

}
