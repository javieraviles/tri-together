import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { Event } from './event';

@Injectable()
export class EventService {

  constructor(private afs: AngularFirestore) {}

  getEvents(): Observable<Event[]> {
    return this.afs.collection<Event>('events').valueChanges();
  }

}
