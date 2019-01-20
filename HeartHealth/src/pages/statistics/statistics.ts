import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { StatisticsProvider } from "../../providers/statistics/statistics";


/**
 * Generated class for the StatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {

  factor = ""

  @ViewChild('barCanvas') barCanvas;
  chartTitle = ""
  recentProfileChartLabel = []
  overallProfileChartLabel = []
  recentProfileData = []
  overallProfileData = []


  barChart: any;
  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseProvider: FirebaseProvider,
    public statisticsProvider: StatisticsProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsPage');
    this.statisticsProvider.getPatientsProfile().then(() => {
      this.recentProfileChartLabel = this.statisticsProvider.getChartLabelForPatientsRecentProfile();
      this.overallProfileChartLabel = this.statisticsProvider.getChartLabelForPatientsOverallProfile()
    })
  }

  initChart(data, labels, title) {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });
  }

  updateChart() {
    switch (this.factor) {
      case "bp": {
        this.initChart(this.statisticsProvider.recentSystolicBpData, this.recentProfileChartLabel ,"Blood Pressure (mm Hg)")
        break;
      }

      case "hr": {
        this.initChart(this.statisticsProvider.recentHrData, this.recentProfileChartLabel ,"Heart Rate (BPM)")
        break;
      }

      case "fitness": {
        this.initChart(this.statisticsProvider.recentFitnessData, this.recentProfileChartLabel ,"Fitness level")
        break;
      }

      case "weight": {
        this.initChart(this.statisticsProvider.recentWeightData, this.recentProfileChartLabel ,"Weight (Kgs)")
        break;
      }
    }
  }

}
