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
  recentCardStyle = ""
  recentPredictionAnalysis = ""
  averageCardStyle = ""
  averagePredictionAnalysis = ""

  predictionObject: any = {} as any
  riskGroupBasedOnRecentRecord = ""
  riskGroupBasedOnAverageRecord = ""

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private predictionProvider: PredictionProvider,
    private firebaseProvider: FirebaseProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PredictionPage');
    this.firebaseProvider
  }

  test() {
    this.predictionProvider.predict(this.experiencedCHD).then((object: any) => {
      console.log(object)
      this.predictionObject = object
      this.riskGroupBasedOnRecentRecord = (object.recentPrediction <= 10) ? "Low Risk Group" : (object.recentPrediction <= 20) ? "Intermediate Risk Group" : "High Risk Group"
      this.riskGroupBasedOnAverageRecord = (object.averagePrediction <= 20) ? "Low Risk Group" : (object.averagePrediction <= 20) ? "Intermediate Risk Group" : "High Risk Group"
      this.recentCardStyle = (object.recentPrediction <= 10) ? "green solid 10px" : (object.recentPrediction <= 20) ? "yellow solid 10px" : "red solid 10px"
      this.averageCardStyle = (object.averagePrediction <= 20) ? "green solid 10px" : (object.averagePrediction <= 20) ? "yellow solid 10px" : "red solid 10px"
    })
  }

}
