import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatInputModule, MatCardModule, MatToolbarModule, MatProgressSpinnerModule } from '@angular/material';

import { AppRoutingModule } from './/app-routing.module';
import { environment } from '../environments/environment';

import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { EventModule } from './events/shared/event.module';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, MatInputModule, MatCardModule, MatToolbarModule, MatProgressSpinnerModule,
    AngularFireModule.initializeApp(firebaseConfig, 'triathlon-club'),
    CoreModule,
    AppRoutingModule,
    SharedModule,
    EventModule,
    FormsModule
  ],
  declarations: [ AppComponent, UserProfileComponent, LoginComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}