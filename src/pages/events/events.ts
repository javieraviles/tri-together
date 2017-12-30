import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Event } from '../../entities/event';
import { EventService } from '../../services/event.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage implements OnInit{

  events: Observable<Event[]>;

  constructor(public navCtrl: NavController,private eventService: EventService) { }

  ngOnInit() {
    this.events = this.eventService.getEventsWithMetaInfo();
  }

  createEvent() {
    this.navCtrl.push('EventFormPage');
  }

}
