import { Injectable } from '@angular/core';



import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import { FirebaseProvider } from "../firebase/firebase";

@Injectable()
export class PredictionProvider {

  private predictionMode = "" //Store the Framingham model used for the prediction.


  constructor(
    private firebaseProvider: FirebaseProvider
  ) {
    console.log('Hello PredictionProvider Provider');
  }

  /**
   * @description: Predicts patients risk score and simulates the prediction to provide feedback on how patient can improve its risk score.
   * @param patientId 
   */
  public predict(patientId?) {
    return new Promise((resolve, reject) => {
      //Obtains patient details
      this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("patients", patientId).then((patient) => {
        let systolicBp = 0
        let averageSystolicBp = 0

        let heartrateBp = 0
        let averageHeartrateBp = 0

        let cholesterol = 0
        let averageCholesterol = 0

        let hdl = 0
        let averageHdl = 0

        let glucose = 0
        let averageGlucose = 0

        const didExperienceCardiovascularDisease = patient.didExperienceCardiovascularDisease //Checks if patient have already experienced a cardiovascular event.
        const isSmoking = patient.isSmoking //this is to simulate the prediction with the assumption that the patient is not smoking... this is to indicate how the prediction will change if the patient quits smoking 
        const isDiabetic = patient.isDiabetic
        const haveHypertension = patient.haveHypertension
        const isTreatedForHypertension = patient.isTreatedForHypertension
        const age = this.getAge(patient.dateOfBirth)
        const isMale = (patient.sex == "male") ? true : false
        this.predictionMode = (patient.didExperienceCardiovascularDisease) ? "Recurrent Coronary Heart Disease (2 Years Risk)" : "Hard Coronary Heart Disease (10 years risk)"
        let recentRecord

        //Obtains patients health profile
        this.firebaseProvider.getPatientsProfile(patientId, 360).then(async data => {
          const size = Object.keys(data).length
          await Object.keys(data).forEach(key => {
            recentRecord = data[key] //Stores patients recent records from its overall profile.
            systolicBp += parseInt(data[key].systolicBloodPressure)
            heartrateBp += parseInt(data[key].hearRate)
            cholesterol += parseInt(data[key].totalCholesterol)
            glucose += parseInt(data[key].glucose)
            hdl += parseInt(data[key].hdlCholesterol)
          })

          if (didExperienceCardiovascularDisease) {
            const recentPrediction = this.predictRecurrentCoronaryHearDiseaseRisk(age, recentRecord.totalCholesterol, recentRecord.hdlCholesterol, recentRecord.systolicBloodPressure, isDiabetic, isSmoking, isMale)
            const averagePrediction = this.predictRecurrentCoronaryHearDiseaseRisk(age, cholesterol / size, hdl / size, systolicBp / size, isDiabetic, isSmoking, isMale)
            const simulatedPredictionResults = this.simulatePredictionByRelaxingRiskFactors(age, isDiabetic, isTreatedForHypertension, haveHypertension, recentRecord, isSmoking, isMale, didExperienceCardiovascularDisease)

            const predictionObject = {
              recentPrediction: recentPrediction,
              averagePrediction: averagePrediction,
              resultAnalysis: this.analysePredictionResults(recentPrediction, averagePrediction),
              simulatedPrediction: {
                results: simulatedPredictionResults,
                resultAnalysis: this.analyseSimulatedPredictionResults(simulatedPredictionResults, recentPrediction)
              }
            }
            resolve(predictionObject)
          } else {
            const recentPrediction = this.predictHardCoronaryHeartDiseaseRisk(age, recentRecord.totalCholesterol, recentRecord.hdlCholesterol, recentRecord.systolicBloodPressure, isTreatedForHypertension, isSmoking, isMale)
            const averagePrediction = this.predictHardCoronaryHeartDiseaseRisk(age, cholesterol / size, hdl / size, systolicBp / size, isTreatedForHypertension, isSmoking, isMale)
            const simulatedPredictionResults = this.simulatePredictionByRelaxingRiskFactors(age, isDiabetic, isTreatedForHypertension, haveHypertension, recentRecord, isSmoking, isMale, didExperienceCardiovascularDisease)


            const predictionObject = {
              recentPrediction: recentPrediction,
              averagePrediction: averagePrediction,
              resultAnalysis: this.analysePredictionResults(recentPrediction, averagePrediction),
              simulatedPrediction: {
                results: simulatedPredictionResults,
                resultAnalysis: this.analyseSimulatedPredictionResults(simulatedPredictionResults, recentPrediction)
              }
            }
            resolve(predictionObject)
          }
        }).catch(error => reject(error))


      })

    })
  }
  
  /**
   * @description:To analyse the simulated prediction results and provide feedback to patient in form of suggestion.
   * @param simulatedPredictionResults 
   * @param recentPrediction 
   */
  private analyseSimulatedPredictionResults(simulatedPredictionResults, recentPrediction) {
    let analysis = []
    const relaxedSmokingPredictionResult = simulatedPredictionResults.relaxedSmoking
    const relaxedBloodPressurePredictionResult = simulatedPredictionResults.relaxedBloodPressure
    const relaxedCholesterolPredictionResult = simulatedPredictionResults.relaxedCholesterol

    analysis.push("Prediction results based on simulations: ")
  
    if (relaxedSmokingPredictionResult && relaxedSmokingPredictionResult < recentPrediction) {
      analysis.push("In this simulation the patient is assumed to be a non smoker. As result, the risk of the patient developing " + this.predictionMode + " is reduced by " + (recentPrediction - relaxedSmokingPredictionResult) + "% to " + relaxedSmokingPredictionResult + "%")
    }

    if (relaxedBloodPressurePredictionResult && relaxedBloodPressurePredictionResult < recentPrediction) {
      analysis.push("In this simulation the patient is assumed to have a normal systolic blood pressure (< 140mmHg). As result, the risk of the patient developing " + this.predictionMode + " is reduced by " + (recentPrediction - relaxedBloodPressurePredictionResult) + "% to " + relaxedBloodPressurePredictionResult + "%")
    }

    if (relaxedCholesterolPredictionResult && relaxedCholesterolPredictionResult < recentPrediction) {
      analysis.push("In this simulation the patient is assumed to have a normal blood cholesterol (< 200mg/dl). As result, the risk of the patient developing " + this.predictionMode + " is reduced by " + (recentPrediction - relaxedCholesterolPredictionResult) + "% to " + relaxedCholesterolPredictionResult + "%")
    }

    return analysis

  } 

  /**
   * @description:To analyse patients prediction results.
   * @param recentPrediction 
   * @param averagePrediction 
   */
  private analysePredictionResults(recentPrediction, averagePrediction) {
    let resultAnalysis = []
    const riskGroupBasedOnRecentRecord = (recentPrediction <= 10) ? "Low Risk Group" : (recentPrediction <= 20) ? "Intermediate Risk Group" : "High Risk Group"
    const riskGroupBasedOnAverageRecord = (averagePrediction <= 20) ? "Low Risk Group" : (averagePrediction <= 20) ? "Intermediate Risk Group" : "High Risk Group"

    const x = (recentPrediction > 10) ? "Patients within Intermediate and High risk groups are strongly advised to consult with their doctor on how they can change their life style to improve their health!" : ""
    const y = (averagePrediction > 10) ? "Patients within Intermediate and High risk groups are strongly advised to consult with their doctor on how they can change their life style to improve their health!" : ""

    resultAnalysis[0] = "Analysis of the results based on patient's recent medical records:"
    resultAnalysis.push("Based on the recent records patient is within " + riskGroupBasedOnRecentRecord + " with " + recentPrediction + "% " + this.predictionMode)
    resultAnalysis.push(x)
    resultAnalysis[3] = "Analysis of the results based on the average of patient's medical profile:"
    resultAnalysis.push("Based on the average records patient is within " + riskGroupBasedOnAverageRecord + " with " + averagePrediction + "% " + this.predictionMode)
    resultAnalysis.push(y)

    return resultAnalysis

  }

  /**
   * @description: To simulate predication by relaxing the smoking, systolic blood pressure, and cholesterol predicators.
   * @param age 
   * @param isDiabetic 
   * @param isTreatedForHypertension 
   * @param haveHypertension 
   * @param recentRecord 
   * @param isSmoking 
   * @param isMale 
   * @param didExperienceCardiovascularDisease 
   */
  private simulatePredictionByRelaxingRiskFactors(age, isDiabetic, isTreatedForHypertension, haveHypertension, recentRecord, isSmoking, isMale, didExperienceCardiovascularDisease) {
    const cholesterol = recentRecord.totalCholesterol
    const hdl = recentRecord.hdlCholesterol
    const sbp = recentRecord.systolicBloodPressure

    if (didExperienceCardiovascularDisease) {
      const predictionBasedOnRelaxdFactors = {
        relaxedSmoking: (isSmoking) ? this.predictRecurrentCoronaryHearDiseaseRisk(age, recentRecord.totalCholesterol, recentRecord.hdlCholesterol, recentRecord.systolicBloodPressure, isDiabetic, false, isMale) : undefined,
        relaxedBloodPressure: (sbp >= 140) ? this.predictRecurrentCoronaryHearDiseaseRisk(age, recentRecord.totalCholesterol, recentRecord.hdlCholesterol, 120, isDiabetic, isSmoking, isMale) : undefined,
        relaxedCholesterol: (cholesterol >= 200) ? this.predictRecurrentCoronaryHearDiseaseRisk(age, recentRecord.totalCholesterol, 190, recentRecord.systolicBloodPressure, isDiabetic, isSmoking, isMale) : undefined,
      }
      return predictionBasedOnRelaxdFactors
    } else {

      const predictionBasedOnRelaxdFactors = {
        relaxedSmoking: (isSmoking) ? this.predictHardCoronaryHeartDiseaseRisk(age, recentRecord.totalCholesterol, recentRecord.hdlCholesterol, recentRecord.systolicBloodPressure, isTreatedForHypertension, false, isMale) : undefined,
        relaxedBloodPressure: (sbp >= 140) ? this.predictHardCoronaryHeartDiseaseRisk(age, recentRecord.totalCholesterol, recentRecord.hdlCholesterol, 120, isTreatedForHypertension, isSmoking, isMale) : undefined,
        relaxedCholesterol: (cholesterol >= 200) ? this.predictHardCoronaryHeartDiseaseRisk(age, recentRecord.totalCholesterol, 190, recentRecord.systolicBloodPressure, isTreatedForHypertension, isSmoking, isMale) : undefined,
      }
      return predictionBasedOnRelaxdFactors
    }



  }

  /**
   * Obtains age from the date of birth
   * @param dob 
   */
  private getAge(dob) {
    const dateOfBirth = new Date(dob);
    const todayDate = new Date()

    const age = todayDate.getFullYear() - dateOfBirth.getFullYear()

    const month = todayDate.getMonth() - dateOfBirth.getMonth()

    /** Based on the current month of the year, if the age is not completed yet, subtract one */
    return (month < 0 || (month === 0 && todayDate.getDate() < dateOfBirth.getDate())) ? age - 1 : age;




  }

  /**
   * @description: To predict the risk of recurrent cardiovascular disease for patients who have experienced a cardiovascular event before.
   * @param age 
   * @param totalCholesterol 
   * @param hdl 
   * @param sbp 
   * @param isDiabetic 
   * @param isSmoking 
   * @param isMale 
   */
  private predictRecurrentCoronaryHearDiseaseRisk(age, totalCholesterol, hdl, sbp, isDiabetic, isSmoking, isMale) {
    const agePoint = this.getPointByAgeForRCHD(age, isMale)
    const cholesterolAndHDLPoints = this.getTotalCholesterolAndHDLPointsForRCHD(totalCholesterol, hdl, isMale)
    const smokingPoint = (!isMale && isSmoking) ? 4 : 0 //4 points if women and smoking else 0 points.
    const systolicBPPoint = this.getSystolicBPPointForRCHD(sbp)
    const diabeticPoint = this.getDiabeticPointForRCHD(isDiabetic, isMale)
    return this.getTotalPointForRCHD((agePoint + cholesterolAndHDLPoints + smokingPoint + diabeticPoint + systolicBPPoint), isMale)
  }

  private getPointByAgeForRCHD(age, isMale) {
    if (age <= 39) return 0
    else if (age <= 44) return 1
    else if (age <= 49) return (isMale) ? 3 : 2
    else if (age <= 54) return (isMale) ? 4 : 3
    else if (age <= 59) return (isMale) ? 6 : 4
    else if (age <= 64) return (isMale) ? 7 : 5
    else if (age <= 69) return (isMale) ? 9 : 6
    else return (isMale) ? 10 : 7
  }

  private getDiabeticPointForRCHD(isDiabetic, isMale) {
    if (isMale) return (isDiabetic) ? 4 : 0
    else return (isDiabetic) ? 3 : 0
  }



  private getTotalCholesterolAndHDLPointsForRCHD(totalC, hdl, isMale) {
    if (totalC <= 160) {
      if (hdl <= 25) return 10
      if (hdl <= 30) return 9
      if (hdl <= 35) return 7
      if (hdl <= 40) return 6
      if (hdl <= 45) return 5
      if (hdl <= 50) return 4
      if (hdl <= 60) return 3
      if (hdl <= 70) return 1
      if (hdl <= 80 || hdl > 80) return 0
    } else if (totalC <= 170) {
      if (hdl <= 25) return 11
      if (hdl <= 30) return 9
      if (hdl <= 35) return 8
      if (hdl <= 40) return 7
      if (hdl <= 45) return 6
      if (hdl <= 50) return 5
      if (hdl <= 60) return 3
      if (hdl <= 70) return 2
      if (hdl <= 80 || hdl > 80) return 1
    } else if (totalC <= 180) {
      if (hdl <= 25) return 11
      if (hdl <= 30) return 10
      if (hdl <= 35) return 8
      if (hdl <= 40) return 7
      if (hdl <= 45) return 6
      if (hdl <= 50) return 5
      if (hdl <= 60) return 4
      if (hdl <= 70) return 2
      if (hdl <= 80 || hdl > 80) return 1
    } else if (totalC <= 190) {
      if (hdl <= 25) return 12
      if (hdl <= 30) return 10
      if (hdl <= 35) return 9
      if (hdl <= 40) return 8
      if (hdl <= 45) return 7
      if (hdl <= 50) return 6
      if (hdl <= 60) return 4
      if (hdl <= 70) return 3
      if (hdl <= 80 || hdl > 80) return 2
    } else if (totalC <= 200) {
      if (hdl <= 25) return 12
      if (hdl <= 30) return 11
      if (hdl <= 35) return 9
      if (hdl <= 40) return 8
      if (hdl <= 45) return 7
      if (hdl <= 50) return 6
      if (hdl <= 60) return 5
      if (hdl <= 70) return 3
      if (hdl <= 80 || hdl > 80) return 2
    } else if (totalC <= 210) {
      if (hdl <= 25) return 13
      if (hdl <= 30) return 11
      if (hdl <= 35) return 10
      if (hdl <= 40) return 9
      if (hdl <= 45) return (isMale) ? 7 : 8
      if (hdl <= 50) return 7
      if (hdl <= 60) return 5
      if (hdl <= 70) return 4
      if (hdl <= 80) return 2
    } else if (totalC <= 220) {
      if (hdl <= 25) return 13
      if (hdl <= 30) return (isMale) ? 11 : 12
      if (hdl <= 35) return 10
      if (hdl <= 40) return 9
      if (hdl <= 45) return 8
      if (hdl <= 50) return 7
      if (hdl <= 60) return 5
      if (hdl <= 70) return 4
      if (hdl <= 80 || hdl > 80) return 3
    } else if (totalC <= 230) {
      if (hdl <= 25) return (isMale) ? 13 : 14
      if (hdl <= 30) return 12
      if (hdl <= 35) return (isMale) ? 10 : 11
      if (hdl <= 40) return 9
      if (hdl <= 45) return 8
      if (hdl <= 50) return 7
      if (hdl <= 60) return 6
      if (hdl <= 70) return 4
      if (hdl <= 80 || hdl > 80) return 3
    } else if (totalC <= 240) {
      if (hdl <= 25) return 14
      if (hdl <= 30) return 12
      if (hdl <= 35) return 11
      if (hdl <= 40) return 10
      if (hdl <= 45) return 9
      if (hdl <= 50) return 8
      if (hdl <= 60) return 6
      if (hdl <= 70) return 5
      if (hdl <= 80 || hdl > 80) return 4
    } else if (totalC <= 250) {
      if (hdl <= 25) return 14
      if (hdl <= 30) return 13
      if (hdl <= 35) return 11
      if (hdl <= 40) return 10
      if (hdl <= 45) return 9
      if (hdl <= 50) return 8
      if (hdl <= 60) return (isMale) ? 6 : 7
      if (hdl <= 70) return 5
      if (hdl <= 80 || hdl > 80) return 4
    } else if (totalC <= 260) {
      if (hdl <= 25) return 15
      if (hdl <= 30) return 13
      if (hdl <= 35) return 12
      if (hdl <= 40) return (isMale) ? 10 : 11
      if (hdl <= 45) return 9
      if (hdl <= 50) return (isMale) ? 8 : 9
      if (hdl <= 60) return 7
      if (hdl <= 70) return (isMale) ? 5 : 6
      if (hdl <= 80 || hdl > 80) return 4
    } else if (totalC <= 270) {
      if (hdl <= 25) return 15
      if (hdl <= 30) return 13
      if (hdl <= 35) return 12
      if (hdl <= 40) return 11
      if (hdl <= 45) return 10
      if (hdl <= 50) return 9
      if (hdl <= 60) return 7
      if (hdl <= 70) return 6
      if (hdl <= 80 || hdl > 80) return 5
    } else if (totalC <= 280) {
      if (hdl <= 25) return 15
      if (hdl <= 30) return 14
      if (hdl <= 35) return 12
      if (hdl <= 40) return 11
      if (hdl <= 45) return 10
      if (hdl <= 50) return 9
      if (hdl <= 60) return (isMale) ? 7 : 8
      if (hdl <= 70) return 6
      if (hdl <= 80 || hdl > 80) return 5
    } else if (totalC <= 290) {
      if (hdl <= 25) return 16
      if (hdl <= 30) return 14
      if (hdl <= 35) return 13
      if (hdl <= 40) return (isMale) ? 11 : 12
      if (hdl <= 45) return 10
      if (hdl <= 50) return (isMale) ? 9 : 10
      if (hdl <= 60) return 8
      if (hdl <= 70) return (isMale) ? 6 : 7
      if (hdl <= 80 || hdl > 80) return 5
    } else if (totalC <= 300 || totalC > 300) {
      if (hdl <= 25) return 16
      if (hdl <= 30) return 14
      if (hdl <= 35) return 13
      if (hdl <= 40) return 12
      if (hdl <= 45) return 11
      if (hdl <= 50) return 10
      if (hdl <= 60) return 8
      if (hdl <= 70) return 7
      if (hdl <= 80 || hdl > 80) return 6
    }
  }

  getTotalPointForRCHD(totalPoint, isMale) {
    if (isMale) {
      if (totalPoint == 0) return 3
      else if (totalPoint <= 2) return 4
      else if (totalPoint <= 4) return 4
      else if (totalPoint <= 6) return 5
      else if (totalPoint <= 8) return 6
      else if (totalPoint <= 10) return 7
      else if (totalPoint <= 12) return 8
      else if (totalPoint <= 14) return 9
      else if (totalPoint <= 16) return 11
      else if (totalPoint <= 18) return 13
      else if (totalPoint <= 20) return 14
      else if (totalPoint <= 22) return 17
      else if (totalPoint <= 24) return 19
      else if (totalPoint <= 26) return 22
      else if (totalPoint <= 28) return 25
      else return 29

    }
    else {
      if (totalPoint <= 6) return 1
      else if (totalPoint <= 12) return 2
      else if (totalPoint <= 16) return 3
      else if (totalPoint = 18) return 4
      else if (totalPoint <= 22) return 5
      else if (totalPoint <= 24) return 7
      else if (totalPoint <= 26) return 8
      else if (totalPoint <= 28) return 9
      else if (totalPoint <= 30) return 11
      else if (totalPoint <= 32) return 13
      else if (totalPoint <= 34) return 16
      else if (totalPoint <= 36) return 19
      else return 22
    }
  }



  private getSystolicBPPointForRCHD(sbp) {
    if (sbp < 110) return 0
    else if (sbp <= 114) return 1
    else if (sbp <= 124) return 3
    else if (sbp <= 134) return 4
    else if (sbp <= 144) return 5
    else if (sbp <= 154) return 6
    else if (sbp <= 164) return 7
    else if (sbp <= 184) return 8
    else if (sbp <= 194) return 9
    else if (sbp <= 214) return 10
    else if (sbp <= 224) return 11
    else if (sbp <= 244) return 12
    else if (sbp >= 245) return 13
  }

  /**
   * @description: To predict risk of cardiovascular disease for patients with no previous cardiovascular disease experience.
   * @param age 
   * @param totalCholesterol 
   * @param hdl 
   * @param sbp 
   * @param isTreatedForHypertension 
   * @param isSmoking 
   * @param isMale 
   */
  private predictHardCoronaryHeartDiseaseRisk(age, totalCholesterol, hdl, sbp, isTreatedForHypertension, isSmoking, isMale) {
    const agePoint = this.getPointByAgeForCHD(age, isMale)
    const cholesterolPoint = this.getTotalCholesterolPointForCHD(age, totalCholesterol, isMale)
    const smokingPoint = this.getSmokingPointForCHD(age, isSmoking, isMale)
    const hdlPoint = this.getHdlPointForCHD(hdl)
    const systolicBPPoint = this.getSystolicBPPointForCHD(sbp, isTreatedForHypertension, isMale)
    //console.log("Prediction is: ", this.getTotalPointForCHD(agePoint + cholesterolPoint + smokingPoint + hdlPoint + systolicBPPoint, true))
    return this.getTotalPointForCHD(agePoint + cholesterolPoint + smokingPoint + hdlPoint + systolicBPPoint, isMale)
  }

  private getPointByAgeForCHD(age, isMale) {
    if (age <= 34) return (isMale) ? -9 : -7
    else if (age <= 39) return (isMale) ? -4 : -3
    else if (age <= 44) return (isMale) ? 0 : 0
    else if (age <= 49) return (isMale) ? 3 : 3
    else if (age <= 54) return (isMale) ? 6 : 6
    else if (age <= 59) return (isMale) ? 8 : 8
    else if (age <= 64) return (isMale) ? 10 : 10
    else if (age <= 69) return (isMale) ? 11 : 12
    else if (age <= 74) return (isMale) ? 12 : 14
    else return (isMale) ? 13 : 16
  }

  private getTotalCholesterolPointForCHD(age, totalCholesterol, isMale) {
    if (totalCholesterol <= 160) {
      return 0;
    } else if (totalCholesterol <= 199) {
      if (age <= 39) return (isMale) ? 4 : 4
      else if (age <= 49) return (isMale) ? 3 : 3
      else if (age <= 59) return (isMale) ? 2 : 2
      else if (age <= 69) return (isMale) ? 1 : 1
      else return (isMale) ? 0 : 1
    } else if (totalCholesterol < 239) {
      if (age <= 39) return (isMale) ? 7 : 8
      else if (age <= 49) return (isMale) ? 5 : 6
      else if (age <= 59) return (isMale) ? 3 : 4
      else if (age <= 69) return (isMale) ? 1 : 2
      else return (isMale) ? 0 : 1
    } else if (totalCholesterol < 279) {
      if (age <= 39) return (isMale) ? 9 : 11
      else if (age <= 49) return (isMale) ? 6 : 8
      else if (age <= 59) return (isMale) ? 4 : 5
      else if (age <= 69) return (isMale) ? 2 : 3
      else return (isMale) ? 1 : 2
    } else if (totalCholesterol >= 280) {
      if (age <= 39) return (isMale) ? 11 : 13
      else if (age <= 49) return (isMale) ? 8 : 10
      else if (age <= 59) return (isMale) ? 5 : 7
      else if (age <= 69) return (isMale) ? 3 : 4
      else return (isMale) ? 1 : 2
    }
  }

  private getSmokingPointForCHD(age, smoking, isMale) {
    if (smoking == true) {
      if (age <= 39) return (isMale) ? 8 : 9
      else if (age <= 49) return (isMale) ? 5 : 7
      else if (age <= 59) return (isMale) ? 3 : 4
      else if (age <= 69) return (isMale) ? 1 : 2
      else return (isMale) ? 1 : 1
    } else {
      return 0;
    }
  }

  private getHdlPointForCHD(hdl) {
    if (hdl < 40) return 2
    else if (hdl <= 49) return 1
    else if (hdl <= 59) return 0
    else return -1



  }

  private getSystolicBPPointForCHD(sbp, isTreated, isMale) {
    if (sbp < 120) return 0
    else if (sbp >= 120 && sbp <= 129) {
      if (isMale) return (isTreated) ? 1 : 0
      else (isTreated) ? 3 : 1
    }
    else if (sbp >= 130 && sbp <= 139) {
      if (isMale) return (isTreated) ? 2 : 1
      else return (isTreated) ? 4 : 2
    }

    else if (sbp >= 140 && sbp <= 159) {
      if (isMale) return (isTreated) ? 2 : 1
      else return (isTreated) ? 5 : 3
    }

    else if (sbp >= 160) {
      if (isMale) return (isTreated) ? 3 : 2
      else (isTreated) ? 6 : 4
    }
  }

  private getTotalPointForCHD(totalPoints, isMale) {
    if (isMale) {
      if (totalPoints < 0) return 0.5
      else if (totalPoints <= 4) return 1
      else if (totalPoints <= 6) return 2
      else if (totalPoints == 7) return 3
      else if (totalPoints == 8) return 4
      else if (totalPoints == 9) return 5
      else if (totalPoints == 10) return 6
      else if (totalPoints == 11) return 8
      else if (totalPoints == 12) return 10
      else if (totalPoints == 13) return 12
      else if (totalPoints == 14) return 16
      else if (totalPoints == 15) return 20
      else if (totalPoints == 16) return 25
      else if (totalPoints >= 17) return 30
    } else {
      if (totalPoints < 9) return 0.5
      else if (totalPoints <= 12) return 1
      else if (totalPoints <= 14) return 2
      else if (totalPoints == 15) return 3
      else if (totalPoints == 16) return 4
      else if (totalPoints == 17) return 5
      else if (totalPoints == 18) return 6
      else if (totalPoints == 19) return 8
      else if (totalPoints == 20) return 11
      else if (totalPoints == 21) return 14
      else if (totalPoints == 22) return 17
      else if (totalPoints == 23) return 22
      else if (totalPoints == 24) return 27
      else if (totalPoints >= 25) return 30
    }
  }
}
