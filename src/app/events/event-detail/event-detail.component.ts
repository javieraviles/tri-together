import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../../core/auth.service';
import { EventService } from '../shared/event.service';
import { ParticipantService } from '../shared/participant.service';

import { Event } from '../shared/event';
import { Participant } from '../shared/participant';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  participate: boolean = false;
  userId: string;

  @Input()
  event: Event;
  
  constructor(private auth: AuthService, private eventService: EventService, private participantService: ParticipantService) { }

  ngOnInit() {
    this.auth.user.subscribe( user => {
      this.userId = user.uid;
      this.participantService.isUserParticipating(this.userId, this.event.id).subscribe( participant => {
        if(participant != null) {
          this.participate = true;
        }
      });
    });
  }

  deleteEvent(id: string) {
    this.eventService.deleteEvent(id).then( () => {
      this.participantService.deleteParticipants(id);
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