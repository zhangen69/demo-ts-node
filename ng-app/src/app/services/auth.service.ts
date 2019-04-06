import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuth = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListerner = new Subject<boolean>();
  private apiUrl = environment.apiUrl + '/service/user';

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  register(formData) {
    this.http.post(this.apiUrl + '/register', formData).subscribe((res: any) => {
      this.toastr.success(res.message);
      this.router.navigate(['/auth/login']);
    }, (res: any) => {
      this.toastr.error(res.error.message);
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
        this.toastr.success(res.message);
        this.router.navigate(['/']);
      }
    }, (res: any) => {
      this.toastr.error(res.error.message);
    });
  }

  forgotPassword(model) {
    return this.http.post(this.apiUrl + '/forgotPassword', model);
  }

  verifyResetPasswordToken(token) {
    return this.http.post(this.apiUrl + '/verifyResetPasswordToken', { token });
  }

  resetPassword(model) {
    this.http.post(this.apiUrl + '/resetPassword', model).subscribe((res: any) => {
      this.toastr.success(res.message);
      this.router.navigate(['/auth/login']);
    }, (res: any) => {
      this.toastr.error(res.error.message);
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

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListerner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.toastr.info('Logged Out!');
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
