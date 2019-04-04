import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuth = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListerner = new Subject<boolean>();
  private apiUrl = environment.apiUrl + '/api/user';

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) { }

  register(formData) {
    this.http.post(this.apiUrl + '/register', formData).subscribe((res: any) => {
      this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
      this.router.navigate(['/auth/login']);
    }, (res: any) => {
      this.snackBar.open(res.error.message, 'Dismiss', { duration: 3000 });
    });
  }

  login(formData) {
    this.http.post(this.apiUrl + '/login', formData).subscribe((res: any) => {
      this.token = res.token;
      this.isAuth = true;
      if (this.token) {
        const expiresIn = res.expiresIn;
        this.setAuthTimer(expiresIn);
        this.authStatusListerner.next(true);
        const now = new Date();
        const expiration = new Date(now.getTime() + (expiresIn * 1000));
        this.saveAuthData(this.token, expiration);
        this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
        this.router.navigate(['/']);
      }
    }, (res: any) => {
      this.snackBar.open(res.error.message, 'Dismiss', { duration: 3000 });
    });
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListerner.asObservable();
  }

  getIsAuth() {
    return this.isAuth;
  }

  getIsExpiredToken() {
    return;
    // const now = new Date();
    // const expiresIn = data.expiration.getTime() - now.getTime();

    // if (expiresIn > 0) {
    //   this.token = data.token;
    //   this.isAuth = true;
    //   this.setAuthTimer(expiresIn);
    //   this.authStatusListerner.next(true);
    // }
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListerner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.snackBar.open('Logged Out!', 'Dismiss', { duration: 3000 });
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const data = this.getAuthData();
    if (!data) {
      return;
    }

    const now = new Date();
    const expiresIn = data.expiration.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = data.token;
      this.isAuth = true;
      this.setAuthTimer(expiresIn);
      this.authStatusListerner.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    if (!token || !expiration) {
      return;
    }

    return { token, expiration: new Date(expiration) };
  }
}
