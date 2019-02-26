import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PredictionProvider } from "../../providers/prediction/prediction";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public predictionProvider: PredictionProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PredictionPage');
  }

  test(){
    console.log("Test Called in page")
    this.predictionProvider.predictRecurrentCoronaryHearDiseaseRisk()
    // this.predictionProvider.test()
  }

}
