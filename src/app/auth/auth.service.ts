import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private token: string;
  constructor(private http: HttpClient) {

  }

  /* created this method so that token retrieved in this service can be used by outer service */
  getToken() {
    return this.token;
  }

  createUser(firstname: string,  lastname: string, email: string, password: string) {
    const newUser: AuthData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password
    };
      this.http.post('http://localhost:3000/api/users/signup', newUser)
        .subscribe(res => {
          console.log(res);
        });
  }

  loginUser(email: string, password: string) {
    const user = {
      email: email,
      password: password
    };
    console.log('auth srv->user.email=', user.email);
    console.log('auth srv->user.password=', user.password);
    this.http.post<{token: string}>('http://localhost:3000/api/users/login', user)
      .subscribe(res => {
        console.log(res);
        const token = res.token;
        this.token = token;
      });
  }
}
