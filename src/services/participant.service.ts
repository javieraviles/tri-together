import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Participant } from '../entities/participant';
import { Observable } from 'rxjs/Observable';

import { EventService } from './event.service';

import { User } from '../entities/user';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ParticipantService {
  
    constructor(private afs: AngularFirestore, private auth: AuthService, private eventService: EventService) { }

    getParticipants(eventId: string) {
      let users: User[] = [];
      return this.afs.collection<Participant>('participants', ref => ref.where('eventId', '==', eventId)).valueChanges().switchMap( (participants) => {

        for (let participant of participants) {
          let isParticipantInUsers = false;
          for (let user of users) {
            if( user.uid === participant.userId) {
              isParticipantInUsers = true;
            }
          }
          if(!isParticipantInUsers) {
            this.auth.getUser(participant.userId).take(1).toPromise().then( (user) => {
              users.push(user);
            })
          }
        }
        users.forEach( (user, i) => {
          let isUserInParticipants = false;
          for (let participant of participants) {
            if(participant.userId === user.uid) {
              isUserInParticipants = true;
            }
          }
          if(!isUserInParticipants) {
            users.splice(i,1)
          }
        });

        return Observable.of(users);
      });
      
    }

    isUserParticipating(userId: string, eventId: string): Observable<Participant> {
      return this.afs.doc<Participant>(`participants/${userId}_${eventId}`).valueChanges();
    }

    createParticipant(userId: string, eventId: string) {
      const participant: Participant = {
        userId,
        eventId
      };

      const participantPath = `participants/${participant.userId}_${participant.eventId}`;

      return this.afs.doc(participantPath).set(participant).then( () => {
        this.eventService.getEventPromise(eventId).then( (event) => {
          let modifiedEvent = event.payload.data();
          modifiedEvent.numberOfParticipants++;
          this.eventService.updateEvent(eventId, modifiedEvent);
        });
      });
    }
  
    deleteParticipant(userId: string, eventId: string) {
      return this.afs.doc<Participant>(`participants/${userId}_${eventId}`).delete().then( () => {
        this.eventService.getEventPromise(eventId).then( (event) => {
          let modifiedEvent = event.payload.data();
          modifiedEvent.numberOfParticipants--;
          this.eventService.updateEvent(eventId, modifiedEvent);
        });
      });
    }

    deleteParticipants(eventId: string) {
      return this.afs.collection<Participant>('participants', ref => ref.where('eventId', '==', eventId))
      .snapshotChanges().forEach(actions => {
        for (let action of actions) {
          const participantId = action.payload.doc.id;
          return this.afs.doc<Participant>(`participants/${participantId}`).delete();
        }
      });
    }

}