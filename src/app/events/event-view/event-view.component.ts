import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from '../../core/auth.service';
import { EventService } from '../shared/event.service';
import { ParticipantService } from '../shared/participant.service';
import { CommentService } from '../shared/comment.service';

import { MatSnackBar, MatTabChangeEvent } from '@angular/material';

import { Event } from '../shared/event';
import { User } from '../../ui/shared/user';
import { Comment } from '../shared/comment';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {

  event: Event = new Event();
  participate: boolean = false;
  participants: User[] = [];
  userId: string;
  eventId = this.route.snapshot.paramMap.get('id');
  comments: Comment[] = [];
  showAddComment: boolean = false;
  newComment: string = "";
  
  constructor( private auth: AuthService, 
    private eventService: EventService, 
    private participantService: ParticipantService, 
    private commentService: CommentService, 
    private route: ActivatedRoute,
    private location: Location, 
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getEvent();

    this.auth.user.subscribe( user => {
      this.userId = user.uid;
      this.participantService.isUserParticipating(this.userId, this.eventId).subscribe( participant => {
        if(participant != null) {
          this.participate = true;
        }
      });
    });

    this.getParticipants();
    this.getComments();
  }
 
  getEvent(): void {
    this.eventService.getEvent(this.eventId).valueChanges().subscribe(event => this.event = event);
  }

  getParticipants() {
    this.participantService.getParticipants(this.eventId).then( (participants) => {
      this.participants = participants;
    })
  }

  getComments() {
    this.commentService.getComments(this.eventId).then( (comments) => {
      this.comments = comments;
    });
  }

  createComment() {
    this.commentService.createComment(this.eventId,this.userId,this.newComment).then( () => {
      this.newComment = "";
      this.getComments();
    });
  }

  setParticipation(participate: boolean): void {
    if(participate) {
      this.participantService.createParticipant(this.userId, this.eventId);
    } else {
      this.participantService.deleteParticipant(this.userId, this.eventId);
    }
    this.participate = participate;
    this.getParticipants();
  }

  goBack(): void {
    this.location.back();
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.showAddComment = tabChangeEvent.index == 1 ? true : false;
  }
  
}
