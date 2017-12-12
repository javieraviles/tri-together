import { Component, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'notification-dialog',
    templateUrl: './notification-dialog.component.html',
    styleUrls: ['./notification-dialog.component.css']
  })
  export class NotificationDialogComponent {
  
    constructor(
      public dialogRef: MatDialogRef<NotificationDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }