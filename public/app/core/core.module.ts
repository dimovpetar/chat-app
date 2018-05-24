import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterService } from './register.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
// import { JwtInterceptor } from './jwt.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  exports: [
  ],
  providers: [
    AuthGuard,
    AuthService,
    RegisterService,
  ],
  declarations: [ LoginComponent,  RegisterComponent]
})
export class CoreModule { }
