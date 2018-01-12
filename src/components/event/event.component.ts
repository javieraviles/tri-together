import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ToastController, NavController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { ParticipantService } from '../../services/participant.service';
import { CommentService } from '../../services/comment.service';

import { EventDetailPage } from '../../pages/event-detail/event-detail';

import { Event } from '../../entities/event';
import { User } from '../../entities/user';
import { Comment } from '../../entities/comment';

import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'event',
  templateUrl: './event.component.html'
})
export class EventComponent implements OnInit, OnDestroy  {

  participate: boolean = false;
  userId: string;
  numberOfParticipants: number = 0;
  numberOfComments: number = 0;
  firebaseObservable: any;

  @Input()
  event: Event;
  
  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private auth: AuthService, 
    private eventService: EventService, 
    private participantService: ParticipantService, 
    private commentService: CommentService) { }

  ngOnInit() {
    this.firebaseObservable = this.auth.user.subscribe( (user) => {
      if(user) {
        this.userId = user.uid;
        this.getNumberOfParticipants();
        this.getNumberOfComments();
        this.participantService.isUserParticipating(this.userId, this.event.id).subscribe( participant => {
          if(participant != null) {
            this.participate = true;
          }
        });
      }
    });
  }
  ngOnDestroy() {
    this.firebaseObservable.unsubscribe();
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

   this.eventService.deleteEvent(id).then( () => {

      let toast = this.toastCtrl.create({
        message: 'Event deleted',
        duration: 3000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'UNDO'
      });
    
      toast.onDidDismiss((data, role) => {
        if (role == "close") {
          this.eventService.createEventWithId(this.event);
        }else{
          this.participantService.deleteParticipants(id);
          this.commentService.deleteComments(id);
        }
      });
    
      toast.present();
      
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

  goToEventDetails() {
    this.navCtrl.push(EventDetailPage, {
      'id': this.event.id
    })
  }

}