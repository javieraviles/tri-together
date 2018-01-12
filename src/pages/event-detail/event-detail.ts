import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { EventService } from '../../services/event.service';
import { ParticipantService } from '../../services/participant.service';

import { EventFormPage } from '../event-form/event-form';

import { Event } from '../../entities/event';
import { User } from '../../entities/user';
import { Comment } from '../../entities/comment';


@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {

  firebaseObservableUser: any;
  firebaseObservableEvent: any;
  eventId = this.navParams.data.id;
  event: Event = new Event();
  participate: boolean = false;
  participants: User[] = [];
  userId: string;
  comments: Comment[] = [];
  newComment: string = "";
  eventTab='participants';
  eventAvatarUrl: string = "";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private auth: AuthService, 
    private eventService: EventService, 
    private participantService: ParticipantService, 
    private commentService: CommentService) { }


  ionViewDidLoad() {

    this.firebaseObservableUser = this.auth.user.subscribe( (user) => {
      if(user) {
        this.userId = user.uid;
        this.getEvent();
        this.getParticipants();
        this.getComments();
        this.participantService.isUserParticipating(this.userId, this.eventId).subscribe( participant => {
          if(participant != null) {
            this.participate = true;
          }
        });
      }
    });
    
  }

  ionViewWillUnload() {
    this.firebaseObservableUser.unsubscribe();
    this.firebaseObservableEvent.unsubscribe();
  }

  getEvent(): void {
    this.firebaseObservableEvent = this.eventService.getEvent(this.eventId).valueChanges().subscribe( (event) => {
      this.event = event;
      this.eventAvatarUrl = "./assets/imgs/" + this.event.discipline + ".png";
    });
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

  setParticipation(): void {
    if(this.participate) {
      this.participantService.createParticipant(this.userId, this.eventId);
    } else {
      this.participantService.deleteParticipant(this.userId, this.eventId);
    }
    this.getParticipants();
  }

  editEvent() {
    this.navCtrl.push(EventFormPage, {
      event: this.event,
      eventId: this.eventId
    });
  }

}