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
  private tokenTimer: any; // for token expiresIn timing
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
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/users/login', user)
      .subscribe(res => {
        console.log(res);
        const token = res.token;
        this.token = token;
        if (token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);  // after 3600 seconds = 1h, simply logout user
          console.log(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000); // argument: millionia secs
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate); //
          this.router.navigate(['/']); // redirect back to home
          // after login, set authStatus to true, next( value ) is way to pass
          // new value to Subject
        }

      });
  }
 /* automatic authenticate user if we have token in localStorage */
  autoAuthUser() {
    const autoAuthInfo = this.getAuthData();
    if (!autoAuthInfo) { // only proceed if there is auth Info
        return;
    }
      const now = new Date();
      const expiresIn = autoAuthInfo.expirationDate.getTime() - now.getTime();
      // instead of verify token, we check if expiration date is ahead of cur time
      if (expiresIn > 0) { //
        console.log('not expired.good');
        this.token = autoAuthInfo.token;
        this.isAuthenticated = true; // again tell interested component that user is still valid
        this.setAuthTimer(expiresIn / 1000); // pass secs
        this.authStatusListener.next(this.isAuthenticated);
      }
  }

  /* clear token, set isAuthenticated to false, then tell all insterested component that authStatus changed, how?
  set authStatusListener() remember*/
  logoutUser() {
    // clear token
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer); // delete timer
    this.router.navigate(['/']); // redirect back to home
  }

  /* when the first time login or if the page reload, we need to create a new timer with remaining duration
  args: during is the token's remaining duration in secs*/
  private setAuthTimer(duration: number) {
    console.log('duration=', duration);
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);  // convert to ms
  }

  private getAuthData() {
    const token = localStorage.getItem( 'token' );
    const expirationDate = localStorage.getItem('expiration');
    if (expirationDate && token) {
      return {
        token: token,
        expirationDate: new Date(expirationDate)
      };
    } else {
      return;
    }
  }

  /*  save Token and expiration Data into browser */
  private saveAuthData(token: string, expiresDate: Date) {
    localStorage.setItem('token', token);  // setItem(key, value)
    localStorage.setItem('expiration', expiresDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
