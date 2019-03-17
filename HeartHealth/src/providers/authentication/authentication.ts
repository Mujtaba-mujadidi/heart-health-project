import { Injectable } from '@angular/core';
import { FirebaseProvider } from "../firebase/firebase";

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  isDoctor = false
  constructor(
    private firebaseProvider: FirebaseProvider
  ) {
    console.log('Hello AuthenticationProvider Provider');
  }

  public signUp(emil, password): Promise<any> {
    return this.firebaseProvider.signUp(emil, password)
  }

  public signIn(email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseProvider.signIn(email, password).then(() => {
        this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("userType").then(object => {
          this.isDoctor = object.type == "doctor"
          resolve(object)
        }).catch(error => reject("Please await for your registration to be approved"))
      }).catch(error => reject(error))
    })
  }

  public registerUser(userType, userObject): Promise<any> {
    const nodeRef = (userType == "patient") ? "potentialPatients" : "doctors"

    if (userType == "patient") {
      return this.firebaseProvider.setObjectToFirebaseListWithTheGivenID(nodeRef, {
        name: userObject.name, dateOfBirth: userObject.dateOfBirth, didExperienceCardiovascularDisease: userObject.didExperienceCardiovascularDisease,
        address: userObject.address, email: userObject.email, doctorKey: userObject.doctorKey, height: userObject.height, isDiabetic: userObject.isDiabetic,
        haveHypertension: userObject.haveHypertension, isTreatedForHypertension: userObject.isTreatedForHypertension, isSmoking: userObject.isSmoking
      })

    } else {
      return this.firebaseProvider.setObjectToFirebaseListWithTheGivenID(nodeRef, { name: userObject.name, dateOfBirth: userObject.dateOfBirth, address: userObject.address, email: userObject.email })
    }
  }

  public approvePatientRegistration(patient): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("patients", patient.val(), patient.key).then(() => {
        this.firebaseProvider.removeObjectFromGivenNodeReference("potentialPatients", patient.key).then(() => {
          this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("userType", { type: "patient" }, patient.key)
        })
      })
    })
  }

  public rejectPatientRegistration(patient): Promise<any> {
    return this.firebaseProvider.removeObjectFromGivenNodeReference("potentialPatients", patient.key)
  }

  public logout(){
    return this.firebaseProvider.logout()
  }

}
