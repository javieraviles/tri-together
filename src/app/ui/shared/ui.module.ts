import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule, MatInputModule, MatCardModule } from '@angular/material';

import { SharedModule } from '../../shared/shared.module';

import { UserLoginComponent } from '../user-login/user-login.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    MatButtonModule, MatInputModule, MatCardModule
  ],
  declarations: [
    UserLoginComponent, UserProfileComponent
  ]
})
export class UiModule { }