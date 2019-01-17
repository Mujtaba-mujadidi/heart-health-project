import { Injectable } from '@angular/core';
import { FirebaseProvider } from "../firebase/firebase";

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

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
          resolve(object)
        }).catch(error => reject("Please await for your registration to be approved"))
      }).catch(error => reject(error))
    })
  }

  public registerUser(userType, userObject, potentialPatientDoctorKey?): Promise<any> {
    const nodeRef = (potentialPatientDoctorKey) ? "potentialPatients" : "doctors"
    if (potentialPatientDoctorKey) {
      return this.firebaseProvider.setObjectToFirebaseListWithTheGivenID(nodeRef, { name: userObject.name, dateOfBirth: userObject.dateOfBirth, address: userObject.address, email: userObject.email, doctorKey: potentialPatientDoctorKey })
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

}
