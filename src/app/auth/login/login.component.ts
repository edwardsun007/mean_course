import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false; // disable spinner

  constructor(private _auth: AuthService) { }

  ngOnInit() {
  }

  onlogin(form: NgForm) {
    this.isLoading = true;
    this._auth.loginUser(form.value.email, form.value.password);
  }

}
