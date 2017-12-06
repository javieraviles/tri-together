import { Component, OnInit } from '@angular/core';

import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: string = null;

  constructor(private auth: AuthService) {}
  
  ngOnInit() {}
  
  signIn(email, password) {
    this.error = null;
    this.auth.emailSignIn(email, password).then().catch((err) => this.error = err )
  }
    
}