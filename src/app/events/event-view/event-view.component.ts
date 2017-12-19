import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from '../../core/auth.service';
import { EventService } from '../shared/event.service';
import { ParticipantService } from '../shared/participant.service';

import { MatSnackBar } from '@angular/material';

import { Event } from '../shared/event';
import { User } from '../../ui/shared/user';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {

  event: Event = new Event();
  participate: boolean = false;
  participants: User[] = [];
  userId: string;
  eventId = this.route.snapshot.paramMap.get('id');
  
  constructor( private auth: AuthService, 
    private eventService: EventService, 
    private participantService: ParticipantService, 
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
  }
 
  getEvent(): void {
    this.eventService.getEvent(this.eventId).valueChanges().subscribe(event => this.event = event);
  }

  getParticipants() {
    this.participantService.getParticipants(this.eventId).then( (participants) => {
      this.participants = participants;
    })
  }

  setParticipation(participate: boolean) {
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
  
}
