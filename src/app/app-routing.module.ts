import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EventsListComponent } from './events/events-list/events-list.component';
import { UserProfileComponent } from './ui/user-profile/user-profile.component';
import { UserLoginComponent } from './ui/user-login/user-login.component';
import { EventViewComponent } from './events/event-view/event-view.component';

import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventsListComponent, canActivate: [AuthGuard] },
  { path: 'events/:id', component: EventViewComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [AuthGuard]
})
export class AppRoutingModule { }