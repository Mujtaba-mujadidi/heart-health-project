import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from "firebase";
import { Observable } from 'rxjs/Observable';

/*
  All connections are made through this class with the Firebase Database.
*/

@Injectable()
export class FirebaseProvider {

  public firebaseAuthor: any; /*Author of the firebase*/
  public loggedInUserUID = "" //UID of the user currently logged in


  constructor(
    public firebaseDatabase: AngularFireDatabase,

  ) {
    console.log('Hello FirebaseProvider Provider');
    this.firebaseAuthor = firebase.auth();
  }

  /**
   * @description To replace/update object into nodeReference with the given id (optional).
   * @param nodeReference: node reference to which object is inserted.
   * @param object: object to be inserted into nodeReference. 
   * @param id: unique key of the object in nodeReference, when undefined, it is set to UID of logged in user. 
   */
  public async setObjectToFirebaseListWithTheGivenID(nodeRef, object, id?) {
    const objectId = (id) ? id : this.firebaseAuthor.currentUser.uid;
    return new Promise((resolve, reject) => {
      firebase.database().ref().child(nodeRef).child(objectId).set(object).then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      })
    })
  }

  /**
    * @description To insert object into nodeReference with the given id (optional).
    * @param nodeReference: node reference to which object is inserted.
    * @param object: object to be inserted into nodeReference. 
    * @param id: unique key of the object in nodeReference, when undefined, it is set to UID of logged in user. 
    */
  public addObjectToFirebaseListWithTheGivenID(nodeRef, object, id?) {
    const objectId = (id) ? id : this.firebaseAuthor.currentUser.uid; //if ID is not provided, use the ID of logged in user
    return firebase.database().ref().child(nodeRef).child(objectId).push(object);
  }

  /**
   * @description To retrieve an observable list for the given node reference.
   * @param nodeReference Name of the node in firebase.
   * @return Observable list retrieved from the node in firebase.
   */
  public getObservables(nodeReference): Observable<any> {
    return this.firebaseDatabase.list(nodeReference).snapshotChanges();

  }

  /**
  * @description To retrieve an observable list for the given node reference which matches the value.
  * @param nodeReference Name of the node in firebase.
  * @return Observable list retrieved from the node in firebase.
  */
  public getObservablesByMatch(nodeReference, orderByChildValue, value?): Observable<any> {
    value = (value) ? value : this.firebaseAuthor.currentUser.uid
    return this.firebaseDatabase.list(nodeReference, ref => ref.orderByChild(orderByChildValue).equalTo(value)).snapshotChanges();
  }


  /**
   * @description To retrieve an object from nodeReference with the matching id (optional)
   * @param nodeReference: node reference from which object is retrieved. 
   * @param id: unique key of the object in nodeReference, when undefined, it is set to UID of logged in user. 
   */
  public getObjectFromNodeReferenceWithTheMatchingId(nodeReference, id?): Promise<any> {
    const childId = (id) ? id : this.firebaseAuthor.currentUser.uid;
    return new Promise((resolve, reject) => {
      firebase.database().ref('/' + nodeReference).child(childId).once('value', (snapshot) => {
        if (snapshot.val()) {
          resolve(snapshot.val())
        } else {
          reject();
        }
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /**
   * @description: To retrieve profile of patient with the matching id (optional) for the give length of time
   * @param id 
   * @param length 
   */
  getPatientsProfile(id?, length?): Promise<any> {
    const childId = (id) ? id : this.loggedInUserUID
    length = (length)? length: 5
    return new Promise((resolve, reject) => {
      firebase.database().ref("patientsHealth").child(childId).limitToLast(length).once('value', snapshot => {
        if (snapshot.val()) {
          resolve(snapshot.val())
        } else {
          reject("This patient health profile is empty!")
        }
      }).catch(error => reject(error))
    })
  }

  /**
   * @description: To get the UID of logged in user.
   */
  public getCurrentUserUid() {
    return this.loggedInUserUID
  }

  /**
   * @description To remove object with the matching key from the nodeReference
   * @param nodeReference: reference to a firebase node. 
   * @param objectKey: key of the object to be removed from the nodeReference. 
   */
  public removeObjectFromGivenNodeReference(nodeReference, objectKey) {
    return this.firebaseDatabase.list(nodeReference).remove(objectKey)
  }


  /**
   * @description: Creates an account in firebase authentication with the given email and password. 
   * @param email 
   * @param password 
   */
  public signUp(email, password): Promise<any> {
    return this.firebaseAuthor.createUserWithEmailAndPassword(email, password);
  }


  /**
   * @description: To sign in with the given email and password.
   * @param email 
   * @param password 
   */
  public signIn(email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseAuthor.signInWithEmailAndPassword(email, password).then(() => {
        this.loggedInUserUID = this.firebaseAuthor.currentUser.uid;
        resolve()
      }).catch(error => reject(error))

    })

  }

  /**
   * @description: To logout of the app.
   */
  public logout(){
    return this.firebaseAuthor.signOut()
  }

  /**
   * @description: To send a reset password link to the given email.
   * @param email 
   */
  public resetPassword(email){
    return this.firebaseAuthor.sendPasswordResetEmail(email)
  }

}
