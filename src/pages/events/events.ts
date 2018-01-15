import { Component } from '@angular/core';
import { ToastController, NavController } from 'ionic-angular';

import { Event } from '../../entities/event';
import { EventFormPage } from '../event-form/event-form';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { ParticipantService } from '../../services/participant.service';
import { CommentService } from '../../services/comment.service';

import { EventDetailPage } from '../../pages/event-detail/event-detail';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  events: Event[];
  userId: string;
  firebaseObservable: any;

  constructor(public navCtrl: NavController, 
    private toastCtrl: ToastController,
    private auth: AuthService, 
    private eventService: EventService, 
    private participantService: ParticipantService,
    private commentService: CommentService) { }

  ionViewDidLoad() {

    this.userId =  this.auth.user.uid;

    this.firebaseObservable = this.eventService.getEventsWithMetaInfo().subscribe( (events) => {
      for(let event of events) {
        this.participantService.isUserParticipating(this.userId, event.id).forEach( (participant) => {
          event.participate = participant != null ? true : false;
        });
      }
      this.events = events
    });

  }

  ionViewWillUnload() {
    this.firebaseObservable.unsubscribe();
  }

  createEvent() {
    this.navCtrl.push(EventFormPage);
  }

  deleteEvent(event: Event) {

    this.eventService.deleteEvent(event.id).then( () => {
 
       let toast = this.toastCtrl.create({
         message: 'Event deleted',
         duration: 3000,
         position: 'bottom',
         showCloseButton: true,
         closeButtonText: 'UNDO'
       });
     
       toast.onDidDismiss((data, role) => {
         if (role == "close") {
           this.eventService.createEventWithId(event);
         }else{
           this.participantService.deleteParticipants(event.id);
           this.commentService.deleteComments(event.id);
         }
       });
     
       toast.present();
       
    });
     
   }
 
   setParticipation(eventId: string, participate: boolean) {
     if(participate) {
       this.participantService.createParticipant(this.userId, eventId);
     } else {
       this.participantService.deleteParticipant(this.userId, eventId);
     }
   }
 
   goToEventDetails(eventId: string) {
     this.navCtrl.push(EventDetailPage, {
       'id': eventId
     })
   }

}