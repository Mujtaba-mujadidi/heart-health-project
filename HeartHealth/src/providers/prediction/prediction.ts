import { Injectable } from '@angular/core';



import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import { FirebaseProvider } from "../firebase/firebase";

/*
  Generated class for the PredictionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PredictionProvider {

  constructor(
    private firebaseProvider: FirebaseProvider

  ) {
    console.log('Hello PredictionProvider Provider');
  }

  public predict(flag, patientId?) {
    this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("patients", patientId).then((patient) => {

      var systolicBp = 0
      var averageSystolicBp = 0

      var heartrateBp = 0
      var averageHeartrateBp = 0

      var cholesterol = 0
      var averageCholesterol = 0

      var hdl = 0
      var averageHdl = 0

      var glucose = 0
      var averageGlucose = 0

      const isSmoking = patient.isSmoking
      const isDiabetic = patient.isDiabetic
      const haveHypertension = patient.haveHypertension
      const isTreatedForHypertension = patient.isTreatedForHypertension
      const age = this.getAge(patient.dateOfBirth)
      const isMale = (patient.sex == "male") ? true : false

      var lastEntry

      this.firebaseProvider.getPatientsRecentProfile(patientId, 360).then(async data => {
        const size = Object.keys(data).length
        console.log(data)
        await Object.keys(data).forEach(key => {
          lastEntry = data[key]
          systolicBp += parseInt(data[key].systolicBloodPressure)
          heartrateBp += parseInt(data[key].hearRate)
          cholesterol += parseInt(data[key].totalCholesterol)
          glucose += parseInt(data[key].glucose)
          hdl += parseInt(data[key].hdlCholesterol) 
        })

        //    //age, totalCholesterol, hdl, sbp, isTreatedForHypertension, isSmoking, isMale


        if (flag) {
          console.log("(True) Flag = ", flag)
          
        } else {
          this.predictHardCoronaryHeartDiseaseRisk(age, lastEntry.totalCholesterol, lastEntry.hdlCholesterol, lastEntry.systolicBloodPressure, isTreatedForHypertension, isSmoking, isMale)
          this.predictHardCoronaryHeartDiseaseRisk(age, cholesterol/size, hdl/size, systolicBp/size ,isTreatedForHypertension, isSmoking, isMale)
          console.log(age, cholesterol/size, hdl/size, systolicBp/size ,isTreatedForHypertension, isSmoking, isMale)
      }
      })


    })


     
  }

  private getAge(dob) {
    const dateOfBirth = new Date(dob);
    const todayDate = new Date()

    const age = todayDate.getFullYear() - dateOfBirth.getFullYear()

    const month = todayDate.getMonth() - dateOfBirth.getMonth()

    /** Based on the current month of the year, if the age is not completed yet, subtract one */
    return (month < 0 || (month === 0 && todayDate.getDate() < dateOfBirth.getDate())) ? age - 1 : age;




  }

  predictRecurrentCoronaryHearDiseaseRisk() {
    const agePoint = this.getPointByAgeForRCHD(27, true)
    const cholesterolAndHDLPoints = this.getTotalCholesterolAndHDLPointsForRCHD(170, 30, true)
    const smokingPoint = (true) ? 0 : (false) ? 4 : 0
    const systolicBPPoint = this.getSystolicBPPointForRCHD(130)
    const diabeticPoint = this.getDiabeticPointForRCHD(true, true)
    console.log("Prediction is: ", this.getTotalPointForRCHD(agePoint + cholesterolAndHDLPoints + smokingPoint + diabeticPoint + systolicBPPoint, true))
  }

  private getPointByAgeForRCHD(age, isMale) {
    if (age >= 35 && age <= 39) return (isMale) ? 0 : 0
    if (age >= 40 && age <= 44) return (isMale) ? 1 : 1
    if (age >= 45 && age <= 49) return (isMale) ? 3 : 2
    if (age >= 50 && age <= 54) return (isMale) ? 4 : 3
    if (age >= 55 && age <= 59) return (isMale) ? 6 : 4
    if (age >= 60 && age <= 64) return (isMale) ? 7 : 5
    if (age >= 65 && age <= 69) return (isMale) ? 9 : 6
    if (age >= 70 && age <= 74) return (isMale) ? 10 : 7
  }

  private getDiabeticPointForRCHD(isDiabetic, isMale) {
    if (isMale) return (isDiabetic) ? 4 : 0
    else return (isDiabetic) ? 3 : 0
  }



  private getTotalCholesterolAndHDLPointsForRCHD(totalC, hdl, isMale) {
    if (totalC == 160) {
      if (hdl == 25) return 10
      if (hdl == 30) return 9
      if (hdl == 35) return 7
      if (hdl == 40) return 6
      if (hdl == 45) return 5
      if (hdl == 50) return 4
      if (hdl == 60) return 3
      if (hdl == 70) return 1
      if (hdl == 80) return 0
    } else if (totalC == 170) {
      if (hdl == 25) return 11
      if (hdl == 30) return 9
      if (hdl == 35) return 8
      if (hdl == 40) return 7
      if (hdl == 45) return 6
      if (hdl == 50) return 5
      if (hdl == 60) return 3
      if (hdl == 70) return 2
      if (hdl == 80) return 1
    } else if (totalC == 180) {
      if (hdl == 25) return 11
      if (hdl == 30) return 10
      if (hdl == 35) return 8
      if (hdl == 40) return 7
      if (hdl == 45) return 6
      if (hdl == 50) return 5
      if (hdl == 60) return 4
      if (hdl == 70) return 2
      if (hdl == 80) return 1
    } else if (totalC == 190) {
      if (hdl == 25) return 12
      if (hdl == 30) return 10
      if (hdl == 35) return 9
      if (hdl == 40) return 8
      if (hdl == 45) return 7
      if (hdl == 50) return 6
      if (hdl == 60) return 4
      if (hdl == 70) return 3
      if (hdl == 80) return 2
    } else if (totalC == 200) {
      if (hdl == 25) return 12
      if (hdl == 30) return 11
      if (hdl == 35) return 9
      if (hdl == 40) return 8
      if (hdl == 45) return 7
      if (hdl == 50) return 6
      if (hdl == 60) return 5
      if (hdl == 70) return 3
      if (hdl == 80) return 2
    } else if (totalC == 210) {
      if (hdl == 25) return 13
      if (hdl == 30) return 11
      if (hdl == 35) return 10
      if (hdl == 40) return 9
      if (hdl == 45) return (isMale) ? 7 : 8
      if (hdl == 50) return 7
      if (hdl == 60) return 5
      if (hdl == 70) return 4
      if (hdl == 80) return 2
    } else if (totalC == 220) {
      if (hdl == 25) return 13
      if (hdl == 30) return (isMale) ? 11 : 12
      if (hdl == 35) return 10
      if (hdl == 40) return 9
      if (hdl == 45) return 8
      if (hdl == 50) return 7
      if (hdl == 60) return 5
      if (hdl == 70) return 4
      if (hdl == 80) return 3
    } else if (totalC == 230) {
      if (hdl == 25) return (isMale) ? 13 : 14
      if (hdl == 30) return 12
      if (hdl == 35) return (isMale) ? 10 : 11
      if (hdl == 40) return 9
      if (hdl == 45) return 8
      if (hdl == 50) return 7
      if (hdl == 60) return 6
      if (hdl == 70) return 4
      if (hdl == 80) return 3
    } else if (totalC == 240) {
      if (hdl == 25) return 14
      if (hdl == 30) return 12
      if (hdl == 35) return 11
      if (hdl == 40) return 10
      if (hdl == 45) return 9
      if (hdl == 50) return 8
      if (hdl == 60) return 6
      if (hdl == 70) return 5
      if (hdl == 80) return 4
    } else if (totalC == 250) {
      if (hdl == 25) return 14
      if (hdl == 30) return 13
      if (hdl == 35) return 11
      if (hdl == 40) return 10
      if (hdl == 45) return 9
      if (hdl == 50) return 8
      if (hdl == 60) return (isMale) ? 6 : 7
      if (hdl == 70) return 5
      if (hdl == 80) return 4
    } else if (totalC == 260) {
      if (hdl == 25) return 15
      if (hdl == 30) return 13
      if (hdl == 35) return 12
      if (hdl == 40) return (isMale) ? 10 : 11
      if (hdl == 45) return 9
      if (hdl == 50) return (isMale) ? 8 : 9
      if (hdl == 60) return 7
      if (hdl == 70) return (isMale) ? 5 : 6
      if (hdl == 80) return 4
    } else if (totalC == 270) {
      if (hdl == 25) return 15
      if (hdl == 30) return 13
      if (hdl == 35) return 12
      if (hdl == 40) return 11
      if (hdl == 45) return 10
      if (hdl == 50) return 9
      if (hdl == 60) return 7
      if (hdl == 70) return 6
      if (hdl == 80) return 5
    } else if (totalC == 280) {
      if (hdl == 25) return 15
      if (hdl == 30) return 14
      if (hdl == 35) return 12
      if (hdl == 40) return 11
      if (hdl == 45) return 10
      if (hdl == 50) return 9
      if (hdl == 60) return (isMale) ? 7 : 8
      if (hdl == 70) return 6
      if (hdl == 80) return 5
    } else if (totalC == 290) {
      if (hdl == 25) return 16
      if (hdl == 30) return 14
      if (hdl == 35) return 13
      if (hdl == 40) return (isMale) ? 11 : 12
      if (hdl == 45) return 10
      if (hdl == 50) return (isMale) ? 9 : 10
      if (hdl == 60) return 8
      if (hdl == 70) return (isMale) ? 6 : 7
      if (hdl == 80) return 5
    } else if (totalC == 300) {
      if (hdl == 25) return 16
      if (hdl == 30) return 14
      if (hdl == 35) return 13
      if (hdl == 40) return 12
      if (hdl == 45) return 11
      if (hdl == 50) return 10
      if (hdl == 60) return 8
      if (hdl == 70) return 7
      if (hdl == 80) return 6
    }
  }

  getTotalPointForRCHD(totalPoint, isMale) {
    if (isMale) {
      if (totalPoint = 0) return 3
      if (totalPoint = 2) return 4
      if (totalPoint = 4) return 4
      if (totalPoint = 6) return 5
      if (totalPoint = 8) return 6
      if (totalPoint = 10) return 7
      if (totalPoint = 12) return 8
      if (totalPoint = 14) return 9
      if (totalPoint = 16) return 11
      if (totalPoint = 18) return 13
      if (totalPoint = 20) return 14
      if (totalPoint = 22) return 17
      if (totalPoint = 24) return 19
      if (totalPoint = 26) return 22
      if (totalPoint = 28) return 25
      if (totalPoint = 30) return 29

    }
    else {
      if (totalPoint <= 6) return 1
      if (totalPoint <= 12) return 2
      if (totalPoint <= 16) return 3
      if (totalPoint = 18) return 4
      if (totalPoint <= 22) return 5
      if (totalPoint = 24) return 7
      if (totalPoint = 26) return 8
      if (totalPoint = 28) return 9
      if (totalPoint = 30) return 11
      if (totalPoint = 32) return 13
      if (totalPoint = 34) return 16
      if (totalPoint = 36) return 19
      if (totalPoint = 38) return 22
    }
  }



  private getSystolicBPPointForRCHD(sbp) {
    if (sbp < 110) return 0
    if (sbp >= 110 && sbp <= 114) return 1
    if (sbp >= 115 && sbp <= 124) return 3
    if (sbp >= 125 && sbp <= 134) return 4
    if (sbp >= 135 && sbp <= 144) return 5
    if (sbp >= 145 && sbp <= 154) return 6
    if (sbp >= 155 && sbp <= 164) return 7
    if (sbp >= 165 && sbp <= 184) return 8
    if (sbp >= 185 && sbp <= 194) return 9
    if (sbp >= 195 && sbp <= 214) return 10
    if (sbp >= 215 && sbp <= 224) return 11
    if (sbp >= 225 && sbp <= 244) return 12
    if (sbp >= 245) return 13
  }


  predictHardCoronaryHeartDiseaseRisk(age, totalCholesterol, hdl, sbp, isTreatedForHypertension, isSmoking, isMale) {
    const agePoint = this.getPointByAgeForCHD(age, isMale)
    const cholesterolPoint = this.getTotalCholesterolPointForCHD(age, totalCholesterol, isMale)
    const smokingPoint = this.getSmokingPointForCHD(age, isSmoking, isMale)
    const hdlPoint = this.getHdlPointForCHD(hdl)
    const systolicBPPoint = this.getSystolicBPPointForCHD(sbp, isTreatedForHypertension, isMale)
    console.log("Prediction is: ", this.getTotalPointForCHD(agePoint + cholesterolPoint + smokingPoint + hdlPoint + systolicBPPoint, true))

  }

  private getPointByAgeForCHD(age, isMale) {
    if (age >= 20 && age <= 34) return (isMale) ? -9 : -7
    if (age >= 35 && age <= 39) return (isMale) ? -4 : -3
    if (age >= 40 && age <= 44) return (isMale) ? 0 : 0
    if (age >= 45 && age <= 49) return (isMale) ? 3 : 3
    if (age >= 50 && age <= 54) return (isMale) ? 6 : 6
    if (age >= 55 && age <= 59) return (isMale) ? 8 : 8
    if (age >= 60 && age <= 64) return (isMale) ? 10 : 10
    if (age >= 65 && age <= 69) return (isMale) ? 11 : 12
    if (age >= 70 && age <= 74) return (isMale) ? 12 : 14
    if (age >= 75 && age <= 79) return (isMale) ? 13 : 16
  }

  private getTotalCholesterolPointForCHD(age, totalCholesterol, isMale) {
    if (totalCholesterol < 160) {
      return 0;
    } else if (totalCholesterol < 199) {
      if (age >= 20 && age <= 39) return (isMale) ? 4 : 4
      if (age >= 40 && age <= 49) return (isMale) ? 3 : 3
      if (age >= 50 && age <= 59) return (isMale) ? 2 : 2
      if (age >= 60 && age <= 69) return (isMale) ? 1 : 1
      if (age >= 70 && age <= 79) return (isMale) ? 0 : 1
    } else if (totalCholesterol < 239) {
      if (age >= 20 && age <= 39) return (isMale) ? 7 : 8
      if (age >= 40 && age <= 49) return (isMale) ? 5 : 6
      if (age >= 50 && age <= 59) return (isMale) ? 3 : 4
      if (age >= 60 && age <= 69) return (isMale) ? 1 : 2
      if (age >= 70 && age <= 79) return (isMale) ? 0 : 1
    } else if (totalCholesterol < 279) {
      if (age >= 20 && age <= 39) return (isMale) ? 9 : 11
      if (age >= 40 && age <= 49) return (isMale) ? 6 : 8
      if (age >= 50 && age <= 59) return (isMale) ? 4 : 5
      if (age >= 60 && age <= 69) return (isMale) ? 2 : 3
      if (age >= 70 && age <= 79) return (isMale) ? 1 : 2
    } else if (totalCholesterol >= 280) {
      if (age >= 20 && age <= 39) return (isMale) ? 11 : 13
      if (age >= 40 && age <= 49) return (isMale) ? 8 : 10
      if (age >= 50 && age <= 59) return (isMale) ? 5 : 7
      if (age >= 60 && age <= 69) return (isMale) ? 3 : 4
      if (age >= 70 && age <= 79) return (isMale) ? 1 : 2
    }
  }

  private getSmokingPointForCHD(age, smoking, isMale) {
    if (smoking == true) {
      if (age >= 20 && age <= 39) return (isMale) ? 8 : 9
      if (age >= 40 && age <= 49) return (isMale) ? 5 : 7
      if (age >= 50 && age <= 59) return (isMale) ? 3 : 4
      if (age >= 60 && age <= 69) return (isMale) ? 1 : 2
      if (age >= 70 && age <= 79) return (isMale) ? 1 : 1
    } else {
      return 0;
    }
  }

  private getHdlPointForCHD(hdl) {
    if (hdl >= 60) return -1
    if (hdl >= 50 && hdl <= 59) return 0
    if (hdl >= 40 && hdl <= 49) return 1
    if (hdl < 40) return 2
  }

  private getSystolicBPPointForCHD(sbp, isTreated, isMale) {
    if (sbp < 120) return 0
    if (sbp >= 120 && sbp <= 129) {
      if (isMale) return (isTreated) ? 1 : 0
      else (isTreated) ? 3 : 1
    }
    if (sbp >= 130 && sbp <= 139) {
      if (isMale) return (isTreated) ? 2 : 1
      else return (isTreated) ? 4 : 2
    }

    if (sbp >= 140 && sbp <= 159) {
      if (isMale) return (isTreated) ? 2 : 1
      else return (isTreated) ? 5 : 3
    }

    if (sbp >= 160) {
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
