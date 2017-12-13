import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Event } from './event';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class EventService {

  eventsCollection: AngularFirestoreCollection<Event>;

  constructor(private afs: AngularFirestore) {
    //this.eventsCollection = this.afs.collection<Event>('events', (ref) => ref.where('createdAt', '>', new Date()).orderBy('createdAt', 'desc'));
    this.eventsCollection = this.afs.collection<Event>('events');
  }

  getEvents(): Observable<Event[]> {
    return this.eventsCollection.valueChanges();
  }

  getEventsWithMetaInfo(): Observable<Event[]> {
    // ['added', 'modified', 'removed']
    return this.eventsCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Event;
        return { id: a.payload.doc.id, name: data.name, createdAt: data.createdAt };
      });
    });
  }

  getEvent(id: string) {
    return this.afs.doc<Event>(`events/${id}`);
  }

  createEvent(newEvent: Partial<Event>) {
    const event = {
      name: newEvent.name,
      createdAt: newEvent.createdAt ? newEvent.createdAt : new Date(),
    };
    return this.eventsCollection.add(event);
  }

  createEventWithId(newEvent: Event) {
    const event = {
      name: newEvent.name,
      createdAt: newEvent.createdAt ? newEvent.createdAt : new Date(),
    };
    return this.eventsCollection.doc(newEvent.id).set(event);
  }

  updateEvent(id: string, event: Partial<Event>) {
    return this.getEvent(id).update(event);
  }

  deleteEvent(id: string) {
    return this.getEvent(id).delete();
  }

}