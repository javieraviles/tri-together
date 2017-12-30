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
import { EventService } from '../services/event.service';
import { CommentService } from '../services/comment.service';
import { ParticipantService } from '../services/participant.service';

import { EventDetailPageModule } from '../pages/event-detail/event-detail.module';
import { EventFormPageModule } from '../pages/event-form/event-form.module';

import { ProfilePage } from '../pages/profile/profile';
import { EventsPage } from '../pages/events/events';
import { TabsPage } from '../pages/tabs/tabs';

import { EventComponent } from '../components/event/event.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    EventsPage,
    TabsPage,
    EventComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    EventDetailPageModule,
    EventFormPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    EventsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    EventService,
    CommentService,
    ParticipantService
  ]
})
export class AppModule {}
