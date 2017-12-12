import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatToolbarModule } from '@angular/material';

import { AppRoutingModule } from './/app-routing.module';
import { environment } from '../environments/environment';

import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { MessagingService } from "./messaging.service";

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { EventModule } from './events/shared/event.module';
import { UiModule } from './ui/shared/ui.module';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, MatToolbarModule,
    AngularFireModule.initializeApp(firebaseConfig),
    CoreModule,
    AppRoutingModule,
    SharedModule,
    EventModule,
    FormsModule,
    UiModule
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ],
  providers: [ MessagingService ]
})
export class AppModule {}