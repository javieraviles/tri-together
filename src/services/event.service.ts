import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Event } from '../entities/event';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/take';

@Injectable()
export class EventService {

  eventsCollection: AngularFirestoreCollection<Event>;

  constructor(private afs: AngularFirestore) {
    this.eventsCollection = this.afs.collection<Event>('events', (ref) => ref.where("start", ">=", new Date()).orderBy('start', 'asc'));
  }

  buildEventForFirebase(inEvent: Partial<Event>) {
    const event = {
      name: inEvent.name,
      discipline: inEvent.discipline, 
      start: new Date(inEvent.start),
      owner: inEvent.owner,
      numberOfComments: inEvent.numberOfComments,
      numberOfParticipants: inEvent.numberOfParticipants,
      imageURL: inEvent.imageURL ? inEvent.imageURL : "",
      createdAt: inEvent.createdAt ? inEvent.createdAt : new Date()
    }
    if(inEvent.place) {
      event['place'] = inEvent.place;
    }
    if(inEvent.description) {
      event['description'] = inEvent.description;
    }
    return event;
  }

  getEvents(): Observable<Event[]> {
    return this.eventsCollection.valueChanges();
  }

  getEventsWithMetaInfo(): Observable<Event[]> {
    // ['added', 'modified', 'removed']
    return this.eventsCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Event;
        return { 
          id: a.payload.doc.id, 
          name: data.name, 
          place: data.place, 
          description: data.description, 
          discipline: data.discipline, 
          start: data.start, 
          owner: data.owner,
          numberOfComments: data.numberOfComments,
          numberOfParticipants: data.numberOfParticipants,
          imageURL: data.imageURL,
          createdAt: data.createdAt
        };
      });
    });
  }

  getEvent(id: string) {
    return this.afs.doc<Event>(`events/${id}`);
  }

  getEventPromise(id: string) {
      return this.afs.doc<Event>(`events/${id}`).snapshotChanges().take(1).toPromise();
  }

  createEvent(newEvent: Partial<Event>) {
    newEvent.numberOfComments = 0;
    newEvent.numberOfParticipants = 0;
    return this.eventsCollection.add(this.buildEventForFirebase(newEvent));
  }

  createEventWithId(newEvent: Event) {
    return this.eventsCollection.doc(newEvent.id).set(this.buildEventForFirebase(newEvent));
  }

  updateEvent(id: string, event: Partial<Event>) {
    return this.getEvent(id).update(this.buildEventForFirebase(event));
  }

  deleteEvent(id: string) {
    return this.getEvent(id).delete();
  }

}