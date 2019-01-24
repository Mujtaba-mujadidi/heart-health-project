import { Injectable } from '@angular/core';
import { FirebaseProvider } from "../firebase/firebase";

/*
  Generated class for the StatisticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StatisticsProvider {

  patientsRecentProfile: any
  patientsOverallProfile: any
  recentProfileChartLabel = []
  recentSystolicBpData = []
  recentDiastolicBpData = []
  recentHrData = []
  recentFitnessData = []
  recentWeightData = []
  overallProfileChartLabel = []

  recentAnalysis = []


  constructor(
    private firebaseProvider: FirebaseProvider
  ) {
    console.log('Hello StatisticsProvider Provider');
  }

  getPatientsProfile(id?) {
    return new Promise((resolve, reject) => {
      this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("patientsHealth", id).then(data => {
        this.patientsOverallProfile = data
        Object.keys(data).forEach(key => {
          this.overallProfileChartLabel.push(key)
        })
      }).then(() => {
        this.firebaseProvider.getPatientsRecentProfile(id).then(data => {
          this.patientsRecentProfile = data
          Object.keys(data).forEach(key => {
            this.recentProfileChartLabel.push(key)
            this.recentSystolicBpData.push(data[key].systolicBloodPressure)
            this.recentDiastolicBpData.push(data[key].diastolicBloodPressure)
            this.recentHrData.push(data[key].hearRate)
            this.recentFitnessData.push(data[key].fitnessLength)
            this.recentWeightData.push(data[key].weight)
          })
          resolve()
        })
      })
    })

  }

  getChartLabelForPatientsRecentProfile() {
    return this.recentProfileChartLabel
  }

  getChartLabelForPatientsOverallProfile() {
    return this.overallProfileChartLabel
  }

  getBloodPressureData() {

  }

  getAnalyses(factor) {
    switch (factor) {
      case "Blood Pressure":
        return this.analyseBloodPressure();
      case "Heart Rate":
        return this.analyseHeartRate()
    }
  }

  analyseBloodPressure() {
    this.recentAnalysis = [];
    const dataSize = this.recentProfileChartLabel.length;
    let toReturn = "";
    const systolicBP = (this.recentSystolicBpData[0] < 140) ? "within normal range \(< 140 mmHg\)" : "above the normal range \(>=140mmHg\)"
    toReturn += "On " + this.recentProfileChartLabel[0] + " your Systolic Blood Pressure was " + systolicBP
    let averageSystolicBloodPressure = parseInt(this.recentSystolicBpData[0]);

    this.recentAnalysis.push("On " + this.recentProfileChartLabel[0] + " your Systolic Blood Pressure was " + systolicBP)


    for (let i = 1; i < dataSize; i++) {
      const systolicBP = (this.recentSystolicBpData[i] < 140) ? "within normal range \(< 140 mmHg\)" : "above the normal range \(>=140mmHg\)"
      const comparison = (this.recentSystolicBpData[i] > this.recentSystolicBpData[i - 1]) ? "increased by " + (this.recentSystolicBpData[i] - this.recentSystolicBpData[i - 1]) : (this.recentSystolicBpData[i] < this.recentSystolicBpData[i - 1]) ? "decreased by " + (this.recentSystolicBpData[i - 1] - this.recentSystolicBpData[i]) : " remained the same "
      toReturn += "\n\nOn " + this.recentProfileChartLabel[i] + " your Systolic Blood Pressure " + comparison + " to " + this.recentSystolicBpData[i] + " mmHg which is " + systolicBP
      this.recentAnalysis.push("On " + this.recentProfileChartLabel[i] + " your Systolic Blood Pressure " + comparison + " to " + this.recentSystolicBpData[i] + " mmHg which is " + systolicBP)
      averageSystolicBloodPressure += parseInt(this.recentSystolicBpData[i])

    }

    toReturn += "\n\nOn average your recent Systolic Blood Pressure was " + ~~(averageSystolicBloodPressure / dataSize) + " mmHg"

    this.recentAnalysis.push("On average your recent Systolic Blood Pressure was " + ~~(averageSystolicBloodPressure / dataSize) + " mmHg")

    return this.recentAnalysis

  }

  analyseHeartRate() {
    this.recentAnalysis = [];
    const dataSize = this.recentProfileChartLabel.length;
    let toReturn = "";
    const heartRate = (this.recentHrData[0] <= 100) ? "within normal range \(<= 100 BPM\)" : "above the normal range \(> 100BPM\)"
    toReturn += "On " + this.recentProfileChartLabel[0] + " your Heart rate was " + heartRate
     this.recentAnalysis.push("On " + this.recentProfileChartLabel[0] + " your Heart rate was " + heartRate);

    let averageHeartRate = parseInt(this.recentHrData[0]);

    for (let i = 1; i < dataSize; i++) {
      const heartRate = (this.recentSystolicBpData[i] < 140) ? "within normal range \(<= 100 BPM\)" : "above the normal range \(> 100BPM\)"
      const comparison = (this.recentHrData[i] > this.recentHrData[i - 1]) ? "increased by " + (this.recentHrData[i] - this.recentHrData[i - 1]) : (this.recentHrData[i] < this.recentHrData[i - 1]) ? "decreased by " + (this.recentHrData[i - 1] - this.recentHrData[i]) : " remained the same "
      toReturn += "\n\nOn " + this.recentProfileChartLabel[i] + " your Heart Rate " + comparison + " to " + this.recentHrData[i] + " BPM which is " + heartRate
      this.recentAnalysis.push("On " + this.recentProfileChartLabel[i] + " your Heart Rate " + comparison + " to " + this.recentHrData[i] + " BPM which is " + heartRate)
      averageHeartRate += parseInt(this.recentHrData[i])
    }

    toReturn += "\n\nOn average your recent Heart Rate was " + ~~(averageHeartRate / dataSize) + " BPM"
    this.recentAnalysis.push("On average your recent Heart Rate was " + ~~(averageHeartRate / dataSize) + " BPM")
    return this.recentAnalysis

  }

  analyseWeight(factor) {
    
  }
}
