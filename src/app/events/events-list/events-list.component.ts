import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Event } from '../shared/event';
import { EventService } from '../shared/event.service';

import { EventFormComponent } from '../event-form/event-form.component';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {

  events: Observable<Event[]>;

  constructor(private eventService: EventService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.events = this.eventService.getEventsWithMetaInfo();
  }

  openEventFormDialog(): void {
    this.dialog.open(EventFormComponent, {
      width: '500px'
    });
  }

}