import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule  } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { MatCardModule, 
  MatButtonModule, 
  MatInputModule, 
  MatSlideToggleModule, 
  MatFormFieldModule, 
  MatSnackBarModule, 
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatTabsModule,
  MatToolbarModule } from '@angular/material';
import { MatNativeDatetimeModule, MatDatetimepickerModule } from '@mat-datetimepicker/core';

import { EventService } from './event.service';
import { ParticipantService } from './participant.service';
import { EventsListComponent } from '../events-list/events-list.component';
import { EventDetailComponent } from '../event-detail/event-detail.component';
import { EventFormComponent } from '../event-form/event-form.component';
import { EventViewComponent } from '../event-view/event-view.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFirestoreModule,
    RouterModule,
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatSlideToggleModule, 
    MatFormFieldModule, 
    MatSnackBarModule, 
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatToolbarModule,
    MatNativeDatetimeModule,
    MatDatetimepickerModule,
    MatTabsModule,
    FormsModule
  ],
  declarations: [
    EventsListComponent,
    EventDetailComponent,
    EventFormComponent,
    EventViewComponent
  ],
  providers: [
    EventService, ParticipantService
  ],
  entryComponents: [
    EventFormComponent
  ],
})
export class EventModule { }