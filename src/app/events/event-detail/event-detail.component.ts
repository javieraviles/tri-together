import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../../core/auth.service';
import { EventService } from '../shared/event.service';
import { ParticipantService } from '../shared/participant.service';
import { CommentService } from '../shared/comment.service';

import { Event } from '../shared/event';
import { User } from '../../ui/shared/user';
import { Comment } from '../shared/comment';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  participate: boolean = false;
  userId: string;
  numberOfParticipants: number = 0;
  numberOfComments: number = 0;

  @Input()
  event: Event;
  
  constructor(
    private auth: AuthService, 
    private eventService: EventService, 
    private participantService: ParticipantService, 
    private commentService: CommentService, 
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

    this.getNumberOfParticipants();
    this.getNumberOfComments();

  }

  getNumberOfParticipants() {
    this.participantService.getNumberOfParticipants(this.event.id).then( (numberOfParticipants) => {
      this.numberOfParticipants = numberOfParticipants;
    })
  }

  getNumberOfComments() {
    this.commentService.getNumberOfComments(this.event.id).then( (numberOfComments) => {
      this.numberOfComments = numberOfComments;
    });
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
          this.commentService.deleteComments(id);
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
    this.getNumberOfParticipants();
  }

}