import { Injectable } from '@angular/core';
import { FirebaseProvider } from "../firebase/firebase";

/*
  Generated class for the StatisticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StatisticsProvider {

  patientsOverallProfile: any

  chartLabel = []
  systolicBpData = []
  diastolicBpData = []
  heartRateData = []
  fitnessData = []
  weightData = []
  recentAnalysis = []


  constructor(
    private firebaseProvider: FirebaseProvider
  ) {
    console.log('Hello StatisticsProvider Provider');
  }

  /**
   * To retrieve patients health profile
   * @param id: ID of the logged in patient or ID of the patient that the doctor wants to monitor.
   * @param length: Period of time for which the patient/doctor wants to have access to patients health profile. If not provided, the last recent 5 records will be retrieved
   * @param minDate
   */
  public async getPatientsHealthProfile(id?, length?, minDate?) {
    minDate = (minDate)? this.formatDate(minDate) : minDate
    return new Promise(async (resolve, reject) => {
      await this.resetData()
      this.firebaseProvider.getPatientsRecentProfile(id, length).then((data) => {
        Object.keys(data).forEach(key => {
          if (minDate && new Date(key) >= new Date(minDate) || !minDate) {
            const label = this.formatDate(key)
            this.chartLabel.push(label)
            this.systolicBpData.push(data[key].systolicBloodPressure)
            this.diastolicBpData.push(data[key].diastolicBloodPressure)
            this.heartRateData.push(data[key].hearRate)
            this.fitnessData.push(data[key].fitnessLength)
            this.weightData.push(data[key].weight)
          }
        })
        resolve()
      }).catch(error => reject(error))

    })
  }

  /**
   * Coverts date to match the UK date and time format
   * @param date : date to be formatted
   */
  private formatDate(date){
    const options = { day: 'numeric', month: 'short', year: 'numeric' }; //To Format Date
    return new Date(date).toLocaleDateString("en-gb", options)
  }

  /**
   * To reset list of data
   */
  private resetData() {
    return new Promise((resolve, reject) => {
      this.chartLabel = []
      this.systolicBpData = []
      this.diastolicBpData = []
      this.heartRateData = []
      this.fitnessData = []
      this.weightData = []
      resolve()
    })
  }


  getChartLabelForPatientsHealthProfile() {
    return this.chartLabel
  }


  getBloodPressureData() {

  }

  getAnalyses(factor) {
    if (this.systolicBpData.length == 0) {
      this.recentAnalysis = [];
      return []
    } else {
      if (this.systolicBpData == []) console.log("Test");
      switch (factor) {
        case "Blood Pressure":
          return this.analyseBloodPressure();
        case "Heart Rate":
          return this.analyseHeartRate()
      }
    }
  }

  analyseBloodPressure() {
    this.recentAnalysis = [];
    if (this.systolicBpData == []) return
    const dataSize = this.chartLabel.length;
    let toReturn = "";
    const systolicBP = (this.systolicBpData[0] < 140) ? "within normal range \(< 140 mmHg\)" : "above the normal range \(>=140mmHg\)"
    toReturn += "On " + this.chartLabel[0] + " your Systolic Blood Pressure was " + systolicBP
    let averageSystolicBloodPressure = parseInt(this.systolicBpData[0]);

    this.recentAnalysis.push("On " + this.chartLabel[0] + " your Systolic Blood Pressure was " + systolicBP)


    for (let i = 1; i < dataSize; i++) {
      const systolicBP = (this.systolicBpData[i] < 140) ? "within normal range \(< 140 mmHg\)" : "above the normal range \(>=140mmHg\)"
      const comparison = (this.systolicBpData[i] > this.systolicBpData[i - 1]) ? "increased by " + (this.systolicBpData[i] - this.systolicBpData[i - 1]) : (this.systolicBpData[i] < this.systolicBpData[i - 1]) ? "decreased by " + (this.systolicBpData[i - 1] - this.systolicBpData[i]) : " remained the same "
      toReturn += "\n\nOn " + this.chartLabel[i] + " your Systolic Blood Pressure " + comparison + " to " + this.systolicBpData[i] + " mmHg which is " + systolicBP
      this.recentAnalysis.push("On " + this.chartLabel[i] + " your Systolic Blood Pressure " + comparison + " to " + this.systolicBpData[i] + " mmHg which is " + systolicBP)
      averageSystolicBloodPressure += parseInt(this.systolicBpData[i])

    }

    toReturn += "\n\nOn average your recent Systolic Blood Pressure was " + ~~(averageSystolicBloodPressure / dataSize) + " mmHg"

    this.recentAnalysis.push("On average your recent Systolic Blood Pressure was " + ~~(averageSystolicBloodPressure / dataSize) + " mmHg")

    return this.recentAnalysis

  }

  analyseHeartRate() {
    this.recentAnalysis = [];
    if (this.heartRateData == []) return
    const dataSize = this.chartLabel.length;
    let toReturn = "";
    const heartRate = (this.heartRateData[0] <= 100) ? "within normal range \(<= 100 BPM\)" : "above the normal range \(> 100BPM\)"
    toReturn += "On " + this.chartLabel[0] + " your Heart rate was " + heartRate
    this.recentAnalysis.push("On " + this.chartLabel[0] + " your Heart rate was " + heartRate);

    let averageHeartRate = parseInt(this.heartRateData[0]);

    for (let i = 1; i < dataSize; i++) {
      const heartRate = (this.systolicBpData[i] < 140) ? "within normal range \(<= 100 BPM\)" : "above the normal range \(> 100BPM\)"
      const comparison = (this.heartRateData[i] > this.heartRateData[i - 1]) ? "increased by " + (this.heartRateData[i] - this.heartRateData[i - 1]) : (this.heartRateData[i] < this.heartRateData[i - 1]) ? "decreased by " + (this.heartRateData[i - 1] - this.heartRateData[i]) : " remained the same "
      toReturn += "\n\nOn " + this.chartLabel[i] + " your Heart Rate " + comparison + " to " + this.heartRateData[i] + " BPM which is " + heartRate
      this.recentAnalysis.push("On " + this.chartLabel[i] + " your Heart Rate " + comparison + " to " + this.heartRateData[i] + " BPM which is " + heartRate)
      averageHeartRate += parseInt(this.heartRateData[i])
    }

    toReturn += "\n\nOn average your recent Heart Rate was " + ~~(averageHeartRate / dataSize) + " BPM"
    this.recentAnalysis.push("On average your recent Heart Rate was " + ~~(averageHeartRate / dataSize) + " BPM")
    return this.recentAnalysis

  }

  analyseWeight(factor) {

  }
}
