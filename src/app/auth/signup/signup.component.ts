import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(private _auth: AuthService ) { }

  ngOnInit() {
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    this._auth.createUser(
      form.value.firstname,
      form.value.lastname,
      form.value.email,
      form.value.password
    );
  }


}
