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

  showPrediction = false

  cardStyle = "green solid 10px"
  recentCardStyle = ""
  recentPredictionAnalysis = ""
  averageCardStyle = ""
  averagePredictionAnalysis = ""

  resultAnalysis = []

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
  }

  predict() {
    this.predictionProvider.predict(this.experiencedCHD, this.navParams.data).then((object: any) => {
      this.predictionObject = object
      this.riskGroupBasedOnRecentRecord = (object.recentPrediction <= 10) ? "Low Risk Group" : (object.recentPrediction <= 20) ? "Intermediate Risk Group" : "High Risk Group"
      this.riskGroupBasedOnAverageRecord = (object.averagePrediction <= 20) ? "Low Risk Group" : (object.averagePrediction <= 20) ? "Intermediate Risk Group" : "High Risk Group"
      this.recentCardStyle = (object.recentPrediction <= 10) ? "green solid 10px" : (object.recentPrediction <= 20) ? "yellow solid 10px" : "red solid 10px"
      this.averageCardStyle = (object.averagePrediction <= 20) ? "green solid 10px" : (object.averagePrediction <= 20) ? "yellow solid 10px" : "red solid 10px"
      this.showPrediction = true
      this.analyseResults()
    })
  }

  analyseResults() {
    this.resultAnalysis = []
    const recentResult = this.predictionObject.recentPrediction
    const averageResult = this.predictionObject.averagePrediction

    const x = (recentResult > 10) ? "Patients within Intermediate and High risk groups are strongly advised to consult with their doctor on how they can change their life style to improve their health!" : ""
    const y = (averageResult > 10) ? "Patients within Intermediate and High risk groups are strongly advised to consult with their doctor on how they can change their life style to improve their health!" : ""

    this.resultAnalysis[0] = "Analysis of the results based on patients recent medical records:"
    this.resultAnalysis.push("Based on your recent records you are within " + this.riskGroupBasedOnRecentRecord + " with " + recentResult + "% risk of developing hard diseases within 10 years time")
    this.resultAnalysis.push(x)
    this.resultAnalysis[3] = "***"
    this.resultAnalysis[4] = "Analysis of the results based on the average of patients medical profile:"
    this.resultAnalysis.push("Based on your average records you are within " + this.riskGroupBasedOnAverageRecord + " with " + averageResult + "% risk of developing hard diseases within 10 years time")
    this.resultAnalysis.push(y)
  }
}
