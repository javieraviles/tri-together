import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailPage } from './event-detail';

import { TimeAgoPipe } from '../../pipes/time-ago-pipe';

@NgModule({
  declarations: [
    EventDetailPage,
    TimeAgoPipe
  ],
  imports: [
    IonicPageModule.forChild(EventDetailPage),
  ],
})
export class EventDetailPageModule { }
