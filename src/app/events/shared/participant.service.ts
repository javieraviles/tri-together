import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Participant } from './participant';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { User } from '../../ui/shared/user';
import { AuthService } from '../../core/auth.service';

@Injectable()
export class ParticipantService {
  
    constructor(private afs: AngularFirestore, private auth: AuthService) { }

    getParticipants(eventId: string) {
      let users: User[] = [];
      return new Promise<User[]>((resolve,reject) => {
        this.afs.collection<Participant>('participants', ref => ref.where('eventId', '==', eventId)).valueChanges().take(1).subscribe( participants => {
          for (let participant of participants) {
            this.auth.getUser(participant.userId).take(1).subscribe((user) => {
              users.push(user);
            })
          }
          resolve(users);
        });
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

      return this.afs.doc(participantPath).set(participant);
    }
  
    deleteParticipant(userId: string, eventId: string) {
      return this.afs.doc<Participant>(`participants/${userId}_${eventId}`).delete();
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