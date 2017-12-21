import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';

import { Event } from '../shared/event';

import { AuthService } from '../../core/auth.service';
import { EventService } from '../shared/event.service';
import { MessagingService } from '../../messaging.service';

@Component({
  selector: 'event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {

  event: Event = new Event();
  userId: string;
  disciplines = [
    {value: 'swimming', label: 'Swimming'},
    {value: 'cycling', label: 'Cycling'},
    {value: 'running', label: 'Running'},
    {value: 'other', label: 'Other'}
  ];

  constructor(
    private auth: AuthService, 
    private eventService: EventService, 
    private messagingService: MessagingService,
    public snackBar: MatSnackBar, 
    public dialogRef: MatDialogRef<EventFormComponent>) { }

  ngOnInit() {
    this.auth.user.subscribe( user => {
      this.userId = user.uid;
    });
  }

  createEvent() {
    let undoTriggered: boolean = false;

    this.eventService.createEvent(this.event).then( (event) => {
      //this.event = new Event();
      let snackBarRef = this.snackBar.open("Event created", "UNDO", {
        duration: 3000,
      });
      snackBarRef.onAction().subscribe(() => {
        this.eventService.deleteEvent(event.id);
        undoTriggered = true;
      });
      snackBarRef.afterDismissed().subscribe(() => {
        if(!undoTriggered) {
          this.messagingService.createMessage("New event: " + this.event.name,this.event.description,this.userId);
        }
      });
    });

    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}