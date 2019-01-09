import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isAuthenticated = false; // init as unauthenticated because post-list doesn't get updated userAuthenticated status and
  // edit delete button won't show even user is logged in
  private token: string;

  private authStatusListener = new Subject<boolean>();  // Subject usually are used for things that can change overtime
  // token should be cleared after logout for example
  // authStatusListener will push new info to Component that subscribe it when there is change
  // here set it to boolean type, because Header doesn't need to consume the actual token header only need to know
  // whether there is a token
  constructor(private http: HttpClient, private router: Router) {

  }

  /* created this method so that token retrieved in this service can be used by outer service */
  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
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
          this.router.navigate(['/']); // redirect back to home
        });
  }

  loginUser(email: string, password: string) {
    const user = {
      email: email,
      password: password
    };
    this.http.post<{token: string}>('http://localhost:3000/api/users/login', user)
      .subscribe(res => {
        console.log(res);
        const token = res.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']); // redirect back to home
          // after login, set authStatus to true, next( value ) is way to pass
          // new value to Subject
        }

      });
  }

  /* clear token, set isAuthenticated to false, then tell all insterested component that authStatus changed, how?
  set authStatusListener() remember*/
  logoutUser() {
    // clear token
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(this.isAuthenticated);
    this.router.navigate(['/']); // redirect back to home
  }
}
