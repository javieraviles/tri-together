import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';

import { Event } from '../shared/event';

import { EventService } from '../shared/event.service';

@Component({
  selector: 'event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {

  event: Event = new Event();

  constructor(
    private eventService: EventService, 
    public snackBar: MatSnackBar, 
    public dialogRef: MatDialogRef<EventFormComponent>) { }

  createEvent() {
    this.eventService.createEvent(this.event).then( () => {
      this.event = new Event();
      let snackBarRef = this.snackBar.open("Event created", "", {
        duration: 3000,
      });
    });
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}