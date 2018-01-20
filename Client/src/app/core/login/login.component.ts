import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router/';
import { User } from '../../interfaces/user';
import { AlertService } from '../../shared/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: User;
  public loading;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService) {
      this.user = {};
      this.loading = false;
  }

  ngOnInit() {
  }

  login() {
    this.loading = true;
    this.authService.login(this.user)
    .subscribe( data => {
      this.router.navigate(['/']);
    }, e => {
          this.alertService.error(e.error);
          this.loading = false;
    });
  }
}
