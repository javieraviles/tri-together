import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { environment } from '../environments/environment';

import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../services/auth.service';
import { UploadService } from '../services/upload.service';
import { EventService } from '../services/event.service';
import { CommentService } from '../services/comment.service';
import { ParticipantService } from '../services/participant.service';

import { ProfilePage } from '../pages/profile/profile';
import { EventsPage } from '../pages/events/events';
import { TabsPage } from '../pages/tabs/tabs';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { EventFormPage } from '../pages/event-form/event-form';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TimeAgoPipe } from '../pipes/time-ago-pipe';

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    EventsPage,
    TabsPage,
    EventDetailPage,
    EventFormPage,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    EventsPage,
    TabsPage,
    EventDetailPage,
    EventFormPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    EventService,
    CommentService,
    ParticipantService,
    UploadService
  ]
})
export class AppModule {}