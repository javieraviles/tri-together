import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Triathlon club';
  error: string = null;

  constructor(private auth: AuthService) {}

  signIn(email, password) {
    this.error = null;
    this.auth.emailSignIn(email, password).then().catch((err) => this.error = err )
  }

}