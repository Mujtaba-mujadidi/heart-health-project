import { Injectable } from '@angular/core';
import { FirebaseProvider } from "../firebase/firebase";

/*
  Provides authentication and authorization services.
*/
@Injectable()
export class AuthenticationProvider {

  isDoctor = false //Is the user type a doctor

  constructor(
    private firebaseProvider: FirebaseProvider
  ) {
    console.log('Hello AuthenticationProvider Provider');
  }

  /**
   * @description: To sign up with the provided email and password.
   * @param emil 
   * @param password 
   */
  public signUp(emil, password): Promise<any> {
    return this.firebaseProvider.signUp(emil, password)
  }

  /**
   * @description: To login into the app with the given email and password.
   */
  public signIn(email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseProvider.signIn(email, password).then(() => {
        this.firebaseProvider.getObjectFromNodeReferenceWithTheMatchingId("userType").then(object => {
          this.isDoctor = object.type == "doctor";
          resolve(object)
        }).catch(error => reject("Please await for your registration to be approved"))
      }).catch(error => reject(error))
    })
  }

  /**
   * @description: To register user into the firebase
   * @param userType : Type of the user being registered.
   * @param userObject : user details.
   */
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

  /**
   * @description: To approve a potential patient registration.
   * @param patient 
   */
  public approvePatientRegistration(patient): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("patients", patient.val(), patient.key).then(() => {
        this.firebaseProvider.removeObjectFromGivenNodeReference("potentialPatients", patient.key).then(() => {
          this.firebaseProvider.setObjectToFirebaseListWithTheGivenID("userType", { type: "patient" }, patient.key)
        })
      })
    })
  }

  /**
   * @description: To reject a potential patient registration.
   * @param patient 
   */
  public rejectPatientRegistration(patient): Promise<any> {
    return this.firebaseProvider.removeObjectFromGivenNodeReference("potentialPatients", patient.key)
  }

  /**
   * @description: To logout of the application.
   */
  public logout(){
    return this.firebaseProvider.logout()
  }

  /**
   * @description: To send a reset password link to the corresponding email.
   * @param email 
   */
  public resetPassword(email){
   return this.firebaseProvider.resetPassword(email)
  }

}
