import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PredictionProvider } from "../../providers/prediction/prediction";
import { FirebaseProvider } from "../../providers/firebase/firebase";


@IonicPage()
@Component({
  selector: 'page-prediction',
  templateUrl: 'prediction.html',
})
export class PredictionPage {


  private showPrediction = false //To show and hide the prediction results

  private recentCardStyle = "" //Used to dynamically set the card style for the prediction result based on the recent records.
  // private recentPredictionAnalysis = ""
  private averageCardStyle = "" //Used to dynamically set the card style for the prediction result based on the average records.
  // private averagePredictionAnalysis = ""

  private resultAnalysis = [] //Analysis of the prediction result.
  private simulatedResultsAnalysis = [] //Analysis of the the simulated prediction results.

  private predictionObject: any = {} as any //Prediction object contains the result and analysis of the actual prediction and simulated prediction.
  private riskGroupBasedOnRecentRecord = ""  
  private riskGroupBasedOnAverageRecord = ""  

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
  

  /**
   * @description: To predict the patient's risk of cardiovascular diseases.
   */
  private predict() {
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

  /**
   * @description: To set the CSS for the cards based on the results.
   */
  private initCardStyle() {
    this.riskGroupBasedOnRecentRecord = (this.predictionObject.recentPrediction <= 10) ? "Low Risk Group" : (this.predictionObject.recentPrediction <= 20) ? "Intermediate Risk Group" : "High Risk Group"
    this.riskGroupBasedOnAverageRecord = (this.predictionObject.averagePrediction <= 20) ? "Low Risk Group" : (this.predictionObject.averagePrediction <= 20) ? "Intermediate Risk Group" : "High Risk Group"
    this.recentCardStyle = (this.predictionObject.recentPrediction <= 10) ? "green solid 10px" : (this.predictionObject.recentPrediction <= 20) ? "yellow solid 10px" : "red solid 10px"
    this.averageCardStyle = (this.predictionObject.averagePrediction <= 20) ? "green solid 10px" : (this.predictionObject.averagePrediction <= 20) ? "yellow solid 10px" : "red solid 10px"
  }
}
