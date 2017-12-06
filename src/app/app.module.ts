import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatInputModule, MatCardModule, MatToolbarModule, MatProgressSpinnerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './/app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';

import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events/events.component';
import { EventService } from './events/event.service';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, MatInputModule, MatCardModule, MatToolbarModule, MatProgressSpinnerModule, // imports components to be used from angular-material
    AngularFireModule.initializeApp(environment.firebase, 'triathlon-club'), // imports firebase/app needed for everything
    CoreModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [ AppComponent, EventsComponent, UserProfileComponent, LoginComponent, LoadingSpinnerComponent ],
  bootstrap: [ AppComponent ],
  providers: [ EventService ]
})
export class AppModule {}