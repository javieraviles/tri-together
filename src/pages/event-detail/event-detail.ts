import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { EventService } from '../../services/event.service';
import { ParticipantService } from '../../services/participant.service';

import { Event } from '../../entities/event';
import { User } from '../../entities/user';
import { Comment } from '../../entities/comment';

@IonicPage({
  name: 'event-detail',
  segment: 'events/:id'
})
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {

  eventId = this.navParams.data.id;
  event: Event = new Event();
  participate: boolean = false;
  participants: User[] = [];
  userId: string;
  comments: Comment[] = [];
  newComment: string = "";
  eventTab='participants';

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private auth: AuthService, 
    private eventService: EventService, 
    private participantService: ParticipantService, 
    private commentService: CommentService) { }


  ionViewDidLoad() {
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

}