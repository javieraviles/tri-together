import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule, MatInputModule, MatCardModule, MatDialogModule } from '@angular/material';

import { UserLoginComponent } from '../user-login/user-login.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    MatButtonModule, MatInputModule, MatCardModule, MatDialogModule
  ],
  declarations: [
    UserLoginComponent, UserProfileComponent, NotificationDialogComponent
  ],
  entryComponents: [ NotificationDialogComponent ]
})
export class UiModule { }