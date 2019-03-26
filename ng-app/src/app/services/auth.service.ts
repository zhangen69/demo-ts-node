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
  private authStatusListerner = new Subject<boolean>();
  private apiUrl = environment.apiUrl + '/service/user';

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
        this.authStatusListerner.next(true);
        this.snackBar.open(res.message, 'Dismiss', { duration: 3000 });
        this.router.navigate(['/product/list']);
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
}
