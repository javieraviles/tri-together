import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { SharedModule } from '../../shared/shared.module';

import { EventService } from './event.service';
import { EventsListComponent } from '../events-list/events-list.component';
import { EventDetailComponent } from '../event-detail/event-detail.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFirestoreModule,
    SharedModule,
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