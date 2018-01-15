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
      return new Promise<User[]>((resolve,reject) => {
        this.afs.collection<Participant>('participants', ref => ref.where('eventId', '==', eventId)).valueChanges().subscribe( participants => {
          for (let participant of participants) {
            this.auth.getUser(participant.userId).subscribe((user) => {
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

      return this.afs.doc(participantPath).set(participant).then( () => {
        this.eventService.getEventPromise(eventId).then( (event) => {
          event.numberOfParticipants++;
          this.eventService.updateEvent(eventId, event);
        });
      });
    }
  
    deleteParticipant(userId: string, eventId: string) {
      return this.afs.doc<Participant>(`participants/${userId}_${eventId}`).delete().then( () => {
        this.eventService.getEventPromise(eventId).then( (event) => {
          event.numberOfParticipants--;
          this.eventService.updateEvent(eventId, event);
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