import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventFormPage } from './event-form';

@NgModule({
  declarations: [
    EventFormPage,
  ],
  imports: [
    IonicPageModule.forChild(EventFormPage),
  ],
})
export class EventFormPageModule {}
