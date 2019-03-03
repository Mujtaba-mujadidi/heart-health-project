import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PredictionProvider } from "../../providers/prediction/prediction";
import { FirebaseProvider } from "../../providers/firebase/firebase";

/**
 * Generated class for the PredictionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prediction',
  templateUrl: 'prediction.html',
})
export class PredictionPage {


  experiencedCHD

  cardStyle = "green solid 10px"

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private predictionProvider: PredictionProvider,
    private firebaseProvider : FirebaseProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PredictionPage');
    this.firebaseProvider
  }

  test(){
    this.predictionProvider.predict(this.experiencedCHD)
  }

}
