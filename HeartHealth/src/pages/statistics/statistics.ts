import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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

  @ViewChild('barCanvas') barCanvas
  barChart: any;

  @ViewChild('lineCanvas') lineCanvas
  lineChart: any

  private riskFactor = "Blood Pressure" //Blood pressure is selected by the default.
  private patientHealthProfileLength = "0"  //Length of time the patient health profile is required to be retrieved!

  private resultsAnalysis = [] //Analysis of the results of the selected risk factor.
  private chartTitle = ""
  private healthProfileChartLabel = []
  private suggestion = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public firebaseProvider: FirebaseProvider,
    public statisticsProvider: StatisticsProvider
  ) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad StatisticsPage');
    this.retrievePatientHealthProfile()
  }

  /**
   * @description: To retrieve patients health profile for the optional specified length of time and an optional start date.
   * @param patientHealthProfileLength : Restricts the data retrieval to the specified length.
   * @param startDate : Restricts the data retrieval from this date.
   */
  private retrievePatientHealthProfile(patientHealthProfileLength?, startDate?) {
    this.statisticsProvider.getPatientsHealthProfile(this.navParams.data, patientHealthProfileLength, startDate).then(() => {
      this.healthProfileChartLabel = this.statisticsProvider.chartLabel
      this.updateChart()
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
   * To retrieve Patients health profile for given period of time
   */
  private getPatientHealthProfileForGivenPeriodOfTime() {
    switch (this.patientHealthProfileLength) {
      case "0": { //rRetrieve the most recent 5 records
        this.retrievePatientHealthProfile()
      }
      default: {
        //const options = { day: 'numeric', month: 'short', year: 'numeric' }; //To Format Date
        const tempDate = new Date(); //Initialised to todays date
        tempDate.setDate(tempDate.getDate() - parseInt(this.patientHealthProfileLength)) //Converted to the date that is n date before today
        //const startDate = tempDate.toLocaleDateString("en-gb", options)
        this.retrievePatientHealthProfile(parseInt(this.patientHealthProfileLength), tempDate)
      }

    }
  }

  /**
   * Initialises the Bar chart to visualise patients record
   * @param data 
   * @param labels 
   * @param title 
   */
  private initBarChart(data, labels) {
    const len = data.length
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: this.chartTitle,
          data: data,
          backgroundColor: Array(len).fill('rgba(255, 99, 132, 0.2)'),
          borderColor: Array(len).fill('rgba(255,99,132,1)'),
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

  initLineChart(data, labels) {
    const len = data.length
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.chartTitle,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: data,
            spanGaps: false,
          }
        ]
      }

    });

  }

  /**
   * Update chart to visualise patients records for the selected risk factor
   */
  private updateChart() {
    if (this.barChart !== undefined) { this.barChart.chart.destroy(); } //To avoid placing the chart on top of the previous chart
    if (this.lineChart !== undefined) { this.lineChart.chart.destroy(); } //To avoid placing the chart on top of the previous chart

    this.resultsAnalysis = []

    switch (this.riskFactor) {
      case "Blood Pressure": {
        this.chartTitle = "Blood Pressure (mm Hg)";
        this.initBarChart(this.statisticsProvider.systolicBpData, this.healthProfileChartLabel)
        this.initLineChart(this.statisticsProvider.systolicBpData, this.healthProfileChartLabel)
        this.resultsAnalysis = this.statisticsProvider.getAnalyses(this.riskFactor)
        this.suggestion = this.statisticsProvider.getSuggestion(this.riskFactor)
        break;
      }

      case "Heart Rate": {
        this.chartTitle = "Heart Rate (BPM)";
        this.initBarChart(this.statisticsProvider.heartRateData, this.healthProfileChartLabel)
        this.initLineChart(this.statisticsProvider.heartRateData, this.healthProfileChartLabel)
        this.resultsAnalysis = this.statisticsProvider.getAnalyses(this.riskFactor)
        this.suggestion = this.statisticsProvider.getSuggestion(this.riskFactor)
        break;
      }

      case "Blood Glucose": {
        this.chartTitle = "Blood Glucose (mmol/L)";
        this.initBarChart(this.statisticsProvider.bloodGlucoseData, this.healthProfileChartLabel)
        this.initLineChart(this.statisticsProvider.bloodGlucoseData, this.healthProfileChartLabel)
        this.resultsAnalysis = this.statisticsProvider.getAnalyses(this.riskFactor)
        this.suggestion = this.statisticsProvider.getSuggestion(this.riskFactor)
        break;
      }

      case "Fitness": {
        this.chartTitle = "Fitness level (mins)";
        this.initBarChart(this.statisticsProvider.fitnessData, this.healthProfileChartLabel)
        this.initLineChart(this.statisticsProvider.fitnessData, this.healthProfileChartLabel)
        this.suggestion = this.statisticsProvider.getSuggestion(this.riskFactor)
        break;
      }

      case "Weight": {
        this.chartTitle = "Weight (Kgs)";
        this.initBarChart(this.statisticsProvider.weightData, this.healthProfileChartLabel)
        this.initLineChart(this.statisticsProvider.fitnessData, this.healthProfileChartLabel)
        this.suggestion = this.statisticsProvider.getSuggestion(this.riskFactor)
        break;
      }
    }
  }

}
