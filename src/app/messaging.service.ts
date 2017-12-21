import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MatDialog } from '@angular/material';
import { NotificationDialogComponent } from './ui/notification-dialog/notification-dialog.component';

@Injectable()
export class MessagingService {

  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, public dialog: MatDialog) { }

  createMessage(title: string, body: string, userId: string) {
    const message = {
      title: title,
      body: body,
      userId: userId
    }
    return this.afs.collection('messages').add(message);
  }

  createToken(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;
      const data = { 'token': token }
      this.afs.collection('fcmTokens').doc(user.uid).set(data)
    })
  }

  updateToken(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;
      const data = { 'token': token }
      this.afs.doc<any>(`fcmTokens/${user.uid}`).update(data);
    })
  }

  getPermission(isUserNew: boolean) {
      this.messaging.requestPermission()
      .then(() => {
        return this.messaging.getToken()
      })
      .then(token => {
        isUserNew ? this.createToken(token) : this.updateToken(token)
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
    }

    receiveMessage() {
       this.messaging.onMessage((payload) => {
        this.currentMessage.next(payload)
        this.openDialog(this.currentMessage.value.notification)
      });
    }

    openDialog(message): void {
      let dialogRef = this.dialog.open(NotificationDialogComponent, {
        width: '250px',
        data: { title: message.title, body: message.body }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed with result: ' + result);
      });
  
    }

}