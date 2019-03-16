import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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


  // experiencedCHD

  showPrediction = false

  cardStyle = "green solid 10px"
  recentCardStyle = ""
  recentPredictionAnalysis = ""
  averageCardStyle = ""
  averagePredictionAnalysis = ""

  resultAnalysis = []
  simulatedResultsAnalysis = []

  predictionObject: any = {} as any
  riskGroupBasedOnRecentRecord = ""
  riskGroupBasedOnAverageRecord = ""

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private predictionProvider: PredictionProvider,
    private firebaseProvider: FirebaseProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PredictionPage');
    this.predict()
  }
  

  predict() {
    this.predictionProvider.predict(this.navParams.data).then((object: any) => {
      this.predictionObject = object
      this.showPrediction = true;
      this.resultAnalysis = object.resultAnalysis
      this.simulatedResultsAnalysis = object.simulatedPrediction.resultAnalysis
      this.initCardStyle()
    }).catch(error => {
      this.alertCtrl.create({
        message: error,
        buttons: [
          {
            text: 'Proceed to home page',
            handler: () => {
              console.log(error)
              this.navCtrl.parent.select(0)
            }
          }
        ]
      }).present()
    })
  }

  initCardStyle() {
    this.riskGroupBasedOnRecentRecord = (this.predictionObject.recentPrediction <= 10) ? "Low Risk Group" : (this.predictionObject.recentPrediction <= 20) ? "Intermediate Risk Group" : "High Risk Group"
    this.riskGroupBasedOnAverageRecord = (this.predictionObject.averagePrediction <= 20) ? "Low Risk Group" : (this.predictionObject.averagePrediction <= 20) ? "Intermediate Risk Group" : "High Risk Group"
    this.recentCardStyle = (this.predictionObject.recentPrediction <= 10) ? "green solid 10px" : (this.predictionObject.recentPrediction <= 20) ? "yellow solid 10px" : "red solid 10px"
    this.averageCardStyle = (this.predictionObject.averagePrediction <= 20) ? "green solid 10px" : (this.predictionObject.averagePrediction <= 20) ? "yellow solid 10px" : "red solid 10px"
    // this.showPrediction = true

    // this.resultAnalysis = []
    // const recentResult = this.predictionObject.recentPrediction
    // const averageResult = this.predictionObject.averagePrediction

    // const predictionType = this.predictionProvider.predictionMode


    // const x = (recentResult > 10) ? "Patients within Intermediate and High risk groups are strongly advised to consult with their doctor on how they can change their life style to improve their health!" : ""
    // const y = (averageResult > 10) ? "Patients within Intermediate and High risk groups are strongly advised to consult with their doctor on how they can change their life style to improve their health!" : ""

    // this.resultAnalysis[0] = "Analysis of the results based on patients recent medical records:"
    // this.resultAnalysis.push("Based on your recent records you are within " + this.riskGroupBasedOnRecentRecord + " with " + recentResult + "% " + predictionType)
    // this.resultAnalysis.push(x)
    // this.resultAnalysis[3] = "***"
    // this.resultAnalysis[4] = "Analysis of the results based on the average of patients medical profile:"
    // this.resultAnalysis.push("Based on your average records you are within " + this.riskGroupBasedOnAverageRecord + " with " + averageResult + "% " + predictionType)
    // this.resultAnalysis.push(y)
  }
}
