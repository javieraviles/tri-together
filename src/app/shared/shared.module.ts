import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material';


import { LoadingSpinnerComponent } from '../ui/loading-spinner/loading-spinner.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    LoadingSpinnerComponent,
  ],
  exports: [
    LoadingSpinnerComponent,
  ],
})
export class SharedModule { }