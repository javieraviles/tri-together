import { Component, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../../core/auth.service';
import { EventService } from '../shared/event.service';
import { ParticipantService } from '../shared/participant.service';

import { Event } from '../shared/event';
import { User } from '../../ui/shared/user';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  participate: boolean = false;
  userId: string;
  participants: User[];

  @Input()
  event: Event;
  
  constructor(
    private auth: AuthService, 
    private eventService: EventService, 
    private participantService: ParticipantService, 
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.auth.user.subscribe( user => {
      this.userId = user.uid;
      this.participantService.isUserParticipating(this.userId, this.event.id).subscribe( participant => {
        if(participant != null) {
          this.participate = true;
        }
      });
    });

    this.participants = this.participantService.getParticipants(this.event.id);
  }

  deleteEvent(id: string) {

    let undoTriggered: boolean = false;

    this.eventService.deleteEvent(id).then( () => {

      let snackBarRef = this.snackBar.open("Event deleted", "UNDO", {
        duration: 3000,
      });

      snackBarRef.onAction().subscribe(() => {
        this.eventService.createEventWithId(this.event);
        undoTriggered = true;
      });

      snackBarRef.afterDismissed().subscribe(() => {
        if(!undoTriggered) {
          this.participantService.deleteParticipants(id);
        }
      });
      
    });
    
  }

  setParticipation(participate: boolean) {
    if(participate) {
      this.participantService.createParticipant(this.userId, this.event.id);
    } else {
      this.participantService.deleteParticipant(this.userId, this.event.id);
    }
    this.participate = participate;
  }

}