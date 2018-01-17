import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert.service';



@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent
  ],
  providers: [
    AlertService
  ],
  declarations: [AlertComponent]
})
export class SharedModule { }
