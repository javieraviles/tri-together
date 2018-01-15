import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';

import { Event } from '../../entities/event';

import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'page-event-form',
  templateUrl: 'event-form.html',
})
export class EventFormPage {

  event: Event = new Event();
  eventId: string;
  originalEvent: Event = new Event();
  editMode: Boolean = false;
  title: string = "Create event";
  eventModified: boolean = false;
  userId: string;
  disciplines = [
    {value: 'swimming', label: 'Swimming'},
    {value: 'cycling', label: 'Cycling'},
    {value: 'running', label: 'Running'},
    {value: 'other', label: 'Other'}
  ];

  constructor(public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private auth: AuthService, 
    private eventService: EventService ) {
      
      this.userId = this.auth.user.uid;
      this.editMode = Boolean(navParams.get('event'));

      if(this.editMode) {
        this.event = navParams.get('event');
        this.eventId = navParams.get('eventId');
        this.originalEvent = JSON.parse(JSON.stringify(this.event));
        this.title = "Edit event";
      }
  }

  ionViewWillLeave() {
    if(!this.eventModified && this.editMode) {
      Object.assign(this.event, this.originalEvent);
    }
  }

  saveEvent() {

    if(!this.editMode) {
      this.event.owner = this.userId;
      this.eventService.createEvent(this.event).then( (event) => {
        
        let toast = this.toastCtrl.create({
          message: 'Event created',
          duration: 3000,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'UNDO'
        });
      
        toast.onDidDismiss((data, role) => {
          if (role == "close") {
            this.eventService.deleteEvent(event.id);
          }
        });
      
        toast.present();

      });
    } else {

      this.eventModified = true;

      this.eventService.updateEvent(this.eventId, this.event).then( () => {
      
        let toast = this.toastCtrl.create({
          message: 'Event modified',
          duration: 3000,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'UNDO'
        });
      
        toast.onDidDismiss((data, role) => {
          if (role == "close") {
            this.eventService.updateEvent(this.eventId, this.originalEvent).then( () => {
              Object.assign(this.event, this.originalEvent);
            });
          }
        });
      
        toast.present();
  
      });
    }

    this.viewCtrl.dismiss();
  }

}
