import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { MatCardModule, MatButtonModule, MatInputModule, MatSlideToggleModule } from '@angular/material';

import { EventService } from './event.service';
import { ParticipantService } from './participant.service';
import { EventsListComponent } from '../events-list/events-list.component';
import { EventDetailComponent } from '../event-detail/event-detail.component';
import { EventFormComponent } from '../event-form/event-form.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFirestoreModule,
    MatCardModule, MatButtonModule, MatInputModule, MatSlideToggleModule,
    FormsModule
  ],
  declarations: [
    EventsListComponent,
    EventDetailComponent,
    EventFormComponent
  ],
  providers: [
    EventService, ParticipantService
  ],
})
export class EventModule { }