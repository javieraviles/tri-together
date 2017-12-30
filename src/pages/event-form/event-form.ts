import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,ViewController } from 'ionic-angular';

import { Event } from '../../entities/event';

import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';

@IonicPage()
@Component({
  selector: 'page-event-form',
  templateUrl: 'event-form.html',
})
export class EventFormPage {

  event: Event = new Event();
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
  }

  ionViewDidLoad() {
    this.auth.user.subscribe( user => {
      this.userId = user.uid;
    });
  }

  createEvent() {

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

    this.viewCtrl.dismiss();
  }

}
