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

  getBloodPressureData(){
    this.recentProfileChartLabel.forEach(key => {

    })
  }
}
