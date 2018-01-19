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
  participations: boolean[] = [];
  participationsObservables: any = [];

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
        if(this.participations[event.id] == null) {
          this.participationsObservables[event.id] = this.participantService.isUserParticipating(this.userId, event.id).subscribe( (participant) => {
            this.participations[event.id] = Boolean(participant);
          });
        }
      }
      
      this.events = events
    });

  }

  ionViewWillUnload() {
    this.firebaseObservable.unsubscribe();
    for(let observable of this.participationsObservables) {
      observable.unsubscribe();
    }
  }

  swipeMainTab(event: any): void {
    if(event.direction === 2) {
      this.navCtrl.parent.select(1);
    }
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
 
   goToEventDetails(eventId: string, tab: string) {
     this.navCtrl.push(EventDetailPage, {
       'id': eventId,
       'tab': tab
     })
   }

}