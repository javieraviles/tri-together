import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from './core/auth.service';
import { MessagingService } from "./messaging.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit  {
  
  title = 'Triathlon club';
  showNav: boolean = true;

  navLinks = [
    { path: '/events', label: 'Events' },
    { path: '/profile', label: 'Profile' }
  ]

  constructor(private auth: AuthService, 
    private msgService: MessagingService,
    private location: Location,
    private router: Router ) {
      router.events.subscribe((event)=>{
          this.showNav = this.location.path().length < 10 ? true : false;
      });
     }
  
  ngOnInit() {
    this.msgService.getPermission(false);
    this.msgService.receiveMessage();
  }

  getMainContainerHeight() {
    return this.showNav ? "calc(100vh - 48px)" : "100vh";
  }

}