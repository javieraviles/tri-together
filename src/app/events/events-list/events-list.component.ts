import { Component, OnInit } from '@angular/core';

import { Event } from '../shared/event';
import { EventService } from '../shared/event.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {

  events: Observable<Event[]>;
  name: string;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.events = this.eventService.getEventsWithMetaInfo();
  }

  createEvent() {
    this.eventService.createEvent(this.name);
    this.name = '';
  }

}