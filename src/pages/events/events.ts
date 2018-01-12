import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Event } from '../../entities/event';
import { EventService } from '../../services/event.service';
import { EventFormPage } from '../event-form/event-form';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  events: Observable<Event[]>;

  constructor(public navCtrl: NavController, private eventService: EventService) { }

  ionViewDidLoad() {
    this.events = this.eventService.getEventsWithMetaInfo();
  }

  createEvent() {
    this.navCtrl.push(EventFormPage);
  }

}