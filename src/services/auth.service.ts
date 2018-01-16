import { Injectable } from '@angular/core';

import { LoadingController } from 'ionic-angular';

import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from 'rxjs/Observable';

import { User } from '../entities/user';

@Injectable()
export class AuthService {

  userObservable: Observable<User>;
  user: User;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public loadingCtrl: LoadingController) { 

    let loader = loadingCtrl.create({
      content: "Loading...",
    });
    loader.present();

    this.userObservable = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          this.user = user;
          loader.dismiss();
          return this.getUser(user.uid);
        } else {
          loader.dismiss();
          return Observable.of(null);
        }
      })
  }

  emailSignUp(email: string, password: string, displayName:string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const data: User = {
          email: user.email,
          displayName: displayName,
          uid: user.uid
        }
        return this.createUserData(data).then( () => {
          this.afAuth.auth.currentUser.updateProfile({displayName:displayName,photoURL:""});
        });
      })
  }

  emailSignIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email,password)
      .then((user) => {
        this.updateUserData(user)
      })
  }

  signOut() {
    return this.afAuth.auth.signOut().then(() => {
      
    });
  }

  private createUserData(data: User) {
    return this.afs.collection<Event>('users').doc(data.uid).set(data);
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      email: user.email,
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL
    }

    return userRef.set(data)

  }

  getUser(userId: string) {
    return this.afs.doc<User>(`users/${userId}`).valueChanges();
  }

  updateProfilePic(photoURL: string) {
    const modifiedUser = {
      uid: this.user.uid,
      displayName: this.user.displayName,
      photoURL: photoURL,
      email: this.user.email
    }

    this.afAuth.auth.currentUser.updateProfile({displayName: this.user.displayName, photoURL: photoURL});
    this.afs.doc<User>(`users/${this.user.uid}`).update(modifiedUser);
  }

}