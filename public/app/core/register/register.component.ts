import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../core/register.service';
import { IUser } from '../../../../shared/interfaces/user';
import { AlertService } from '../../shared/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  public loading: boolean;
  public user: IUser = { };

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private alertService: AlertService) { }

  ngOnInit() {  }

  register() {
    this.loading = true;

    this.registerService.register(this.user).subscribe(
      data => {
      this.alertService.success('Registration successful', true);
      this.router.navigate(['/login']);
    }, e => {
      this.alertService.error(e.error);
      this.loading = false;
    });
  }

}
