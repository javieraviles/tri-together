import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { MatCardModule, MatButtonModule, MatInputModule } from '@angular/material';

import { EventService } from './event.service';
import { EventsListComponent } from '../events-list/events-list.component';
import { EventDetailComponent } from '../event-detail/event-detail.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFirestoreModule,
    MatCardModule, MatButtonModule, MatInputModule,
    FormsModule
  ],
  declarations: [
    EventsListComponent,
    EventDetailComponent
  ],
  providers: [
    EventService,
  ],
})
export class EventModule { }