import { Injectable } from '@angular/core';



import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

/*
  Generated class for the PredictionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PredictionProvider {

  constructor() {
    console.log('Hello PredictionProvider Provider');
  }

  predectHardCoronaryHeartDisease() {
    const agePoint = this.getPointByAge(27, true)
    const cholesterolPoint = this.getTotalCholesterolPoint(30, 170, true)
    const smokingPoint = this.getSmokingPoint(27, false, true)
    const hdlPoint = this.getHdlPoint(80)
    const systolicBPPoint = this.getSystolicBPPoint(130, false, true)
    console.log("Prediction is: ", this.getTotalPoint(agePoint + cholesterolPoint + smokingPoint + hdlPoint + systolicBPPoint, true))

  }

  private getPointByAge(age, isMale) {
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

  private getTotalCholesterolPoint(age, totalCholesterol, isMale) {
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

  private getSmokingPoint(age, smoking, isMale) {
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

  private getHdlPoint(hdl) {
    if (hdl >= 60) return -1
    if (hdl >= 50 && hdl <= 59) return 0
    if (hdl >= 40 && hdl <= 49) return 1
    if (hdl < 40) return 2
  }

  private getSystolicBPPoint(sbp, isTreated, isMale) {
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

  private getTotalPoint(totalPoints, isMale) {
    if (isMale) {
      if (totalPoints < 0) return 0.5
      else if (totalPoints == 0) return 1
      else if (totalPoints == 1) return 1
      else if (totalPoints == 2) return 1
      else if (totalPoints == 3) return 1
      else if (totalPoints == 4) return 1
      else if (totalPoints == 5) return 2
      else if (totalPoints == 6) return 2
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
      else if (totalPoints == 9) return 1
      else if (totalPoints == 10) return 1
      else if (totalPoints == 11) return 1
      else if (totalPoints == 12) return 1
      else if (totalPoints == 13) return 2
      else if (totalPoints == 14) return 2
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
