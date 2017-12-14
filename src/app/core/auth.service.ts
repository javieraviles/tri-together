import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { User } from '../ui/shared/user';

@Injectable()
export class AuthService {

  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) { 

  this.user = this.afAuth.authState
    .switchMap(user => {
      if (user) {
        return this.getUser(user.uid);
      } else {
        return Observable.of(null);
      }
    })
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        return this.updateUserData(user);
      })
  }

  emailSignIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email,password)
      .then((user) => {
        this.updateUserData(user)
      })
  }

  private signOut() {
    return this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login'])
    });
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

}