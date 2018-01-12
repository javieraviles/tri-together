import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { EventsPage } from '../events/events';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  error: string = null;
  enableSignUp: boolean = false;
  email: string = "";
  name: string = "";
  password: string = "";
  tab1Root = EventsPage;
  tab2Root = ProfilePage;

  constructor(private auth: AuthService) { }

  signIn(email, password) {
    this.error = null;
    this.auth.emailSignIn(email, password).then( () => this.cleanLoginInputs() ).catch((err) => this.error = err )
  }

  signUp(email, password, displayName) {
    this.error = null;
    this.auth.emailSignUp(email, password, displayName).then( () => this.cleanLoginInputs() ).catch((err) => this.error = err )
  }

  cleanLoginInputs() {
    this.email="";
    this.name="";
    this.password="";
  }

}