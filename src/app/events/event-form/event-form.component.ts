import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Event } from '../shared/event';

import { EventService } from '../shared/event.service';

@Component({
  selector: 'event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {

  event: Event = new Event();

  constructor(private eventService: EventService) { }

  createEvent() {
    this.eventService.createEvent(this.event);
    this.event = new Event();
  }

}