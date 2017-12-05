import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatInputModule, MatCardModule, MatToolbarModule, MatListModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { FormsModule } from '@angular/forms';
import { EventsComponent } from './events/events/events.component';
import { EventService } from './events/event.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, MatInputModule, MatCardModule, MatToolbarModule, MatListModule, // imports components to be used from angular-material
    AngularFireModule.initializeApp(environment.firebase, 'triathlon-club'), // imports firebase/app needed for everything
    CoreModule,
    FormsModule
  ],
  declarations: [ AppComponent, EventsComponent ],
  bootstrap: [ AppComponent ],
  providers: [ EventService ]
})
export class AppModule {}