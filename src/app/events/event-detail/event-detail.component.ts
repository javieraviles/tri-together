import { Component, Input } from '@angular/core';

import { EventService } from '../shared/event.service';

import { Event } from '../shared/event';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {

  @Input()
  event: Event;

  constructor(private eventService: EventService) { }

  deleteEvent(id: string) {
    this.eventService.deleteEvent(id);
  }

}