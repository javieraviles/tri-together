import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Event } from '../entities/event';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class EventService {

  eventsCollection: AngularFirestoreCollection<Event>;

  constructor(private afs: AngularFirestore) {
    //this.eventsCollection = this.afs.collection<Event>('events', (ref) => ref.where('start', '>', new Date()).orderBy('createdAt', 'desc'));
    this.eventsCollection = this.afs.collection<Event>('events');
  }

  buildEventForFirebase(newEvent: Partial<Event>) {
    const event = {
      name: newEvent.name,
      discipline: newEvent.discipline, 
      start: newEvent.start,
      createdAt: newEvent.createdAt ? newEvent.createdAt : new Date()
    }
    if(newEvent.place) {
      event['place'] = newEvent.place;
    }
    if(newEvent.description) {
      event['description'] = newEvent.description;
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
          createdAt: data.createdAt 
        };
      });
    });
  }

  getEvent(id: string) {
    return this.afs.doc<Event>(`events/${id}`);
  }

  createEvent(newEvent: Partial<Event>) {
    return this.eventsCollection.add(this.buildEventForFirebase(newEvent));
  }

  createEventWithId(newEvent: Event) {
    return this.eventsCollection.doc(newEvent.id).set(this.buildEventForFirebase(newEvent));
  }

  updateEvent(id: string, event: Partial<Event>) {
    return this.getEvent(id).update(event);
  }

  deleteEvent(id: string) {
    return this.getEvent(id).delete();
  }

}