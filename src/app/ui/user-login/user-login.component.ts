import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  error: string = null;

  enableSignUp: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}
  
  ngOnInit() {}
  
  signIn(email, password) {
    this.error = null;
    this.auth.emailSignIn(email, password).then( () => this.afterSignIn()).catch((err) => this.error = err )
  }

  signUp(email, password, displayName) {
    this.error = null;
    this.auth.emailSignUp(email, password, displayName).then( () => this.afterSignIn()).catch((err) => this.error = err )
  }

  private afterSignIn() {
    this.router.navigate(['/']);
  }
    
}