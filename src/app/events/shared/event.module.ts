import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material';

import { EventService } from './event.service';
import { EventsListComponent } from '../events-list/events-list.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFireDatabaseModule,
    SharedModule,
    MatCardModule
  ],
  declarations: [
    EventsListComponent,
  ],
  providers: [
    EventService,
  ],
})
export class EventModule { }