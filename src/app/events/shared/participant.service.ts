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

    getParticipants(eventId: string): User[] {
      
      let users: User[] = [];
      this.afs.collection<Participant>('participants', ref => ref.where('eventId', '==', eventId)).valueChanges().subscribe( participants => {
        //Need to clean users before push them again, but there is an empty call in the subscriptor 
        //for some reason; will come back here when i get more familiar with firestore
        for (let participant of participants) {
          this.auth.getUser(participant.userId).subscribe( user => {
            users.push(user);
          });
        }
      });
      return users;
      
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